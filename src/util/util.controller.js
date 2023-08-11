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

exports.reverseGeocode = async (req, res) => {
  try {
    const data = await service.reverseGeocode(req.query.x, req.query.y);
    res.send(data);
  } catch (error) {
    console.error('Error getting geocode:', error);
    res.status(500).send({ error: 'Error getting geocode' });
  }
};

exports.createDummy = async (req, res) => {
  try {
    await service.createDummyData();
    res.status(200).send('Test Data Created Successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating test data');
  }
};
