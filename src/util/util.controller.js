const service = require('./util.service');

exports.youtubeSearch = async (req, res) => {
  try {
    const items = await service.youtubeSearch(req.query.term);
    res.send(items);
  } catch (error) {
    console.error('Error searching YouTube:', error);
    res.status(500).send({ error: 'Error searching YouTube' });
  }
};

exports.Geocode = async (req, res) => {
  try {
    const data = await service.Geocode(req.query.query);
    res.send(data);
  } catch (error) {
    console.error('Error getting geocode:', error);
    res.status(500).send({ error: 'Error getting geocode' });
  }
};

exports.reverseGeocode = async (req, res) => {
  try {
    const data = await service.reverseGeocode(req.query.x, req.query.y);
    res.send(data);
  } catch (error) {
    console.error('Error getting geocode:', error);
    res.status(500).send({ error: 'Error getting geocode' });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const subscription = req.body;
    await service.addSubscription(subscription);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const payload = req.body;
    await service.sendNotificationToAll(payload);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


