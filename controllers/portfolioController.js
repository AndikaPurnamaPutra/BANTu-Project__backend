const Portfolio = require('../models/Portfolio');

exports.create = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: 'Minimal satu file media harus diupload' });
    }

    const mediaUrls = req.files.map((file) => file.path);

    const portfolio = new Portfolio({
      title: req.body.title.trim(),
      description: req.body.description || '',
      category: req.body.category.trim().toLowerCase(),
      media: mediaUrls,
      clientMessage: req.body.clientMessage || '',
      creatorID: req.user.userId, // Menggunakan req.user.userId dari token
    });

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal membuat portofolio.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    // req.user mungkin null jika rute menggunakan optionalAuth
    const userId = req.user ? req.user.userId : null;

    const portfolios = await Portfolio.find()
      .populate({
        path: 'creatorID',
        select: 'firstName username profilePic role',
      })
      .lean();

    const portfoliosWithLikes = portfolios.map((portfolio) => {
      const likesArray = Array.isArray(portfolio.likes) ? portfolio.likes : [];

      return {
        ...portfolio,
        initialLiked: userId
          ? likesArray.some((id) => id.toString() === userId.toString())
          : false,
        likesCount: likesArray.length,
      };
    });

    res.json(portfoliosWithLikes);
  } catch (error) {
    console.error('Error in getAll portfolios:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengambil portofolio.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : null;

    const portfolio = await Portfolio.findById(req.params.id)
      .populate({
        path: 'creatorID',
        select: 'firstName username profilePic role',
      })
      .lean();

    if (!portfolio) {
      return res.status(404).json({ message: 'Portofolio tidak ditemukan.' });
    }

    portfolio.creatorID = portfolio.creatorID || {};
    const likesArray = Array.isArray(portfolio.likes) ? portfolio.likes : [];

    portfolio.initialLiked = userId
      ? likesArray.some((id) => id.toString() === userId.toString())
      : false;
    portfolio.likesCount = likesArray.length;

    res.json(portfolio);
  } catch (error) {
    console.error('getById error:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengambil portofolio.' });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const userId = req.user.userId; // Menggunakan req.user.userId dari token

    if (!userId) {
      return res.status(401).json({ message: 'Tidak terautentikasi.' });
    }

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portofolio tidak ditemukan.' });
    }

    if (!Array.isArray(portfolio.likes)) portfolio.likes = [];

    const likedIndex = portfolio.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    let liked;
    if (likedIndex === -1) {
      portfolio.likes.push(userId);
      liked = true;
    } else {
      portfolio.likes.splice(likedIndex, 1);
      liked = false;
    }

    await portfolio.save();

    res.json({
      message: liked ? 'Disukai' : 'Tidak disukai',
      likesCount: portfolio.likes.length,
      liked,
    });
  } catch (error) {
    console.error('toggleLike error:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengubah status suka.' });
  }
};

exports.update = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    let { title, description, category, clientMessage, media } = req.body;

    const updateData = {
      title,
      description,
      category,
      clientMessage,
    };

    // Logika untuk menangani file media
    if (req.files && req.files.length > 0) {
      // Jika ada file baru yang diunggah, gunakan file baru
      updateData.media = req.files.map((file) => file.path);
    } else if (typeof media === 'string') {
      // Jika tidak ada file baru, tapi 'media' dikirim sebagai string (dari existingMedia)
      try {
        updateData.media = JSON.parse(media); // Parse string JSON kembali menjadi array
        if (!Array.isArray(updateData.media)) {
          return res
            .status(400)
            .json({ message: 'Format media yang sudah ada tidak valid.' });
        }
      } catch (e) {
        console.error('Error parsing existing media:', e);
        return res
          .status(400)
          .json({ message: 'Gagal memproses media yang sudah ada.' });
      }
    } else if (Array.isArray(media)) {
      // Jika 'media' sudah berupa array (misalnya, jika dikirim langsung sebagai JSON biasa tanpa FormData)
      updateData.media = media;
    } else {
      // Jika tidak ada file baru dan tidak ada existingMedia yang valid, set ke array kosong
      updateData.media = [];
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolioId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPortfolio) {
      return res.status(404).json({ message: 'Portofolio tidak ditemukan.' });
    }

    res.json(updatedPortfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengupdate portofolio.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portofolio tidak ditemukan.' });
    }
    res.json({ message: 'Portofolio berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal menghapus portofolio.' });
  }
};
