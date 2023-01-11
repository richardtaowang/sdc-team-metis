let axios = require('axios');

exports.getCart = (req, res) => {

  // console.log('Cart Pinged Server')
  const options = {
    method: 'GET',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/cart`,
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

exports.deleteCart = (req,res) => {

  const options = {
    method: 'DELETE',
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/cart`,
    headers: {Authorization: process.env.AUTH_SECRET}
  };

  axios(options)
  .then(results => {
    var data = JSON.parse(JSON.stringify(results.data));
    res.status(204).send(data);
  })
  .catch(err => {
    console.log('Server error Delete cart:', err);
    res.status(500).send(err);
  })
}

exports.postAddToCart = (req, res) => {

  var cartData = req.body.params;

  var options = {
    url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/cart',
    method: 'POST',
    headers: { Authorization: process.env.AUTH_SECRET },
    "Content-Type": 'application/json',
    data: cartData
  };

  axios(options)
  .then((results) => {
    var cartSuccess = JSON.parse(JSON.stringify(results.data));
    res.status(201).send(cartSuccess);
  })
  .catch((error) => {
    console.log('failure in the api add to cart: ', error);
    res.status(500).send(error);
  });
}