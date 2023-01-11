import React, {useState, useEffect} from 'react';
import axios from 'axios';

function useOverviewProductLogic(focusMainID, setUseProductInfo, setUseCurrentProductOutfitCard, setUseFeaturesPrimaryProduct, setUseProductStyles) {
  // GET Main Product Data
  axios.get(`/ipCurrent`, { params: { id: focusMainID } })
  .then(function (response) {
    // console.log("🚀 ~ file: App.jsx:126 ~ response", response)
    var generalProductInfo = response.data[0];
    setUseProductInfo(generalProductInfo);
    var featuresArrayToChangeKey = generalProductInfo.features;
    var primaryName = generalProductInfo.name;

    var currentProductCardData = response.data[2];

    setUseCurrentProductOutfitCard(currentProductOutfitCard => ({
      ...currentProductCardData
    }));

    (async () => {
      const myAsyncChangeKey = async (obj) => {
        obj['featurePrimary'] = obj['feature'];
        delete obj['feature'];
        obj['valuePrimary'] = obj['value'];
        delete obj['value'];
        obj['namePrimary'] = primaryName;
        return obj;
      };
      const tasks = featuresArrayToChangeKey.map(objOfFeatures => myAsyncChangeKey(objOfFeatures))
      try {
        const primaryFeatures = await Promise.all(tasks);
        setUseFeaturesPrimaryProduct(JSON.stringify(primaryFeatures));
      } catch (err) {
        console.error(err)
      }
    })()

    var allStylesArray = response.data[1].results;
    setUseProductStyles(allStylesArray);

    // Getting Photo URL of current Product and saving it
    for (var i = 0; i < allStylesArray.length; i++) {
      var currentStyleObj = allStylesArray[i];
      if (currentStyleObj['default?'] === true) {
        var photoUrl = currentStyleObj.photos[0].thumbnail_url;
        currentProductCardData.current_thumbnail = photoUrl;
      }
      if (i === allStylesArray.length - 1) {
        var photoUrl = allStylesArray[0].photos[0].thumbnail_url;
        currentProductCardData.current_thumbnail = photoUrl;
      }
    }
    setUseCurrentProductOutfitCard(currentProductOutfitCard => ({
      ...currentProductCardData
    }));
  })
  .catch(function (error) {
    console.log('error GET GeneralInfo: ', error);
  })
};

export default useOverviewProductLogic;