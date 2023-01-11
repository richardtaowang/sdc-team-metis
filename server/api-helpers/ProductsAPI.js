const axios = require('axios')

exports.redirectFromHome = (req, res) => {
  res.redirect('/ip/71704')
}

exports.overviewData = (req, res) => {

  var incomingParamProductId = req.query.id;
  // console.log("🚀 ~ file: ProductsAPI.js:10 ~ incomingParamProductId", incomingParamProductId)

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };

  const options2 = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}/styles`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };

  var currentProductCardData = {};
  var combined = [];

  axios(options)
    .then((result) => {
      var generalProductInfo = result.data;
      currentProductCardData['current_name'] = generalProductInfo.name;
      currentProductCardData.current_category = generalProductInfo.category;
      currentProductCardData.current_price = generalProductInfo.default_price;
      currentProductCardData.current_id = generalProductInfo.id;
      currentProductCardData.current_features = generalProductInfo.features;

      combined.push(result.data);

      // second API call
      axios(options2)
      .then((result) => {
        combined.push(result.data, currentProductCardData);
        res.status(200).send(combined)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err)
      })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err)
    })
}

exports.getCurrentProductCardControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };

  axios(options)
    .then((result) => {
      res.status(200).send(result.data)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err)
    })
}

exports.getProductStylesControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}/styles`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };
  axios(options)
    .then((result) => {
      res.status(200).send(result.data)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err)
    })
}

exports.getRelatedProductCardControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };

  axios(options)
    .then((result) => {
      res.status(200).send(result.data)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err)
    })
}

exports.getProductRelatedControl = (req, res) => {

  var incomingParamProductId = req.query.id;

  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${incomingParamProductId}/related`,
    headers: { Authorization: process.env.AUTH_SECRET },
  };
  axios(options)
    .then((result) => {
      // Logic code controller need to import function
      res.status(200).send(result.data)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err)
    })
};
