const Portfolio = require('../models/Portfolio');

// Create portfolio + upload media
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
      creatorID: req.user,
    });

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all portfolios with creator info and likes data
exports.getAll = async (req, res) => {
  try {
    const userId = req.user;

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
    res.status(500).json({ message: error.message });
  }
};

// Get single portfolio by ID with creator info and likes data
exports.getById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate({
        path: 'creatorID',
        select: 'firstName username profilePic role',
      })
      .lean();

    if (!portfolio)
      return res.status(404).json({ message: 'Portfolio not found' });

    portfolio.creatorID = portfolio.creatorID || {};
    const likesArray = Array.isArray(portfolio.likes) ? portfolio.likes : [];
    const userId = req.user;

    portfolio.initialLiked = userId
      ? likesArray.some((id) => id.toString() === userId.toString())
      : false;
    portfolio.likesCount = likesArray.length;

    res.json(portfolio);
  } catch (error) {
    console.error('getById error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Toggle like/unlike portfolio
exports.toggleLike = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const userId = req.user;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio)
      return res.status(404).json({ message: 'Portfolio not found' });

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
      message: liked ? 'Liked' : 'Unliked',
      likesCount: portfolio.likes.length,
      liked,
    });
  } catch (error) {
    console.error('toggleLike error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update portfolio (tidak untuk update media file)
exports.update = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!portfolio)
      return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete portfolio
exports.delete = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio)
      return res.status(404).json({ message: 'Portfolio not found' });
    res.json({ message: 'Portfolio deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
