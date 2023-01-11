import React, { useEffect, useState, useRef, Suspense } from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
// Import Custom Hooks
import useClickTracker from './hooks/useClickTracker.jsx';
import useCarouselSliderLogic from './hooks/useCarouselSliderLogic.jsx';
import useOverviewProductLogic from './hooks/useOverviewProductLogic.jsx';
import useRelatedProductLogic from './hooks/useRelatedProductLogic.jsx';
import useReviewsLogic from './hooks/useReviewsLogic.jsx';
// Import Components
import Header from "./components/Header.jsx";
const Overview = React.lazy(() => import('./components/overview/overview.jsx'));
const Description = React.lazy(() => import("./components/Description.jsx"));
const RelatedCard = React.lazy(() => import('./components/relatedProductsAndYourOutfit/RelatedCard.jsx'));
const AddToOutfitCard = React.lazy(() => import('./components/relatedProductsAndYourOutfit/AddToOutfitCard.jsx'));
const YourOutfitCard = React.lazy(() => import('./components/relatedProductsAndYourOutfit/YourOutfitCard.jsx'));
const LeftScrollButtonCarousel = React.lazy(() => import('./components/relatedProductsAndYourOutfit/LeftScrollButtonCarousel.jsx'));
const RightScrollButtonCarousel = React.lazy(() => import('./components/relatedProductsAndYourOutfit/RightScrollButtonCarousel.jsx'));
const Questions = React.lazy(() => import('./components/Q&A/Questions.jsx'));
const Reviews = React.lazy(() => import('./components/reviews/Reviews.jsx'));
const Spinner = require('./img/spiffygif_46x46.gif'); // comment out before running Jest Tests

const App = () => {

  const [serverError, setServerError] = useState(false); // Error Handling

  // Overview States
  const [focusProductId, setFocusProductId] = useState(0);
  const [featuresPrimaryProduct, setFeaturesPrimaryProduct] = useState('');
  const [productStyles, setProductStyles] = useState([]);
  const [productInfo, setProductInfo] = useState([]);

  // Related Product/YourOutfit States (currentProductOutfitCard might have to do with Overview)
  const [currentProductOutfitCard, setCurrentProductOutfitCard] = useState({});
  const { moveRight, moveLeft, handleSideScroll, relatedCarourselRef, activeSlide,
    activeSlideRef, prevSlideRef, nextSlideRef, wrapperRef, scrollRelatedProgress, scrollToggleRelatedProgress,
    scrollYourOutfitProgress, scrollToggleYourOutfitProgress, relatedProductsData, setRelatedProductsData,
    yourOutfitList, setYourOutfitList, moveRight2, moveLeft2, handleSideScroll2, yourOutfitCarourselRef, activeSlide2,
    activeSlideRef2, prevSlideRef2, nextSlideRef2, wrapperRef2, onceNext2, onceNext } = useCarouselSliderLogic();

  // Review States
  const [reviewList, setReviewList] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({});
  const [rating, setRating] = useState(0);
  // QnA State
  const [productQnAData, setProductQnAData] = useState([]);

  // For Lazy Loading
  const [bottomHalfView, setBottomHalfView] = useState(false);
  const loadBottomBoundary = useRef(null);

  // const { clickInfo, onClickTracker } = useClickTracker();

  const [cartNumber, setCartNumber] = useState(0);

  // INIT GET Questions&Answers (tucked away for lazy loading)
  // Logic for Lazy Loading on user downwards scroll
  useEffect(() => {
    if (focusProductId === 0) return;
    if (productInfo.length === 0) return;
    if (!loadBottomBoundary?.current) return;

    // Create Observer and set callback action
    const observer = new IntersectionObserver((yourOutfitDiv) => {
      if (yourOutfitDiv[0].isIntersecting) {
        // console.log("Observed Boundary! Loading QnA and Review Modules...");
        setBottomHalfView(true);

        axios.get('/getProductQnA', { params: { id: focusProductId } })
          .then(function (response) {
            setProductQnAData(response.data.results);
          })
          .catch(function (error) {
            console.log('error GET QnA Data: ', error);
          })
        observer.disconnect();
      }
    })

    observer.observe(loadBottomBoundary.current);
  }, [focusProductId, productInfo])

  // Logic for parsing Local Storage for saved Your Outfit
  useEffect(() => {
    const savedOutfitState = JSON.parse(localStorage.getItem("yourOutfitState"));

    if (savedOutfitState) {
      if (savedOutfitState.length > 0) {
        setYourOutfitList(savedOutfitState);
      }
    }
    var targetIdInUrl = parseInt(window.location.pathname[4] + window.location.pathname[5] + window.location.pathname[6] + window.location.pathname[7] + window.location.pathname[8]);
    setFocusProductId(targetIdInUrl);
  }, [])

  // Logic for saving the Your Outfit to local storage
  useEffect(() => {
    // console.log('saving to localStorage...', yourOutfitList)
    localStorage.setItem("yourOutfitState", JSON.stringify(yourOutfitList));
  }, [yourOutfitList]);

  // INITIAL GET Request for new product page
  useEffect(() => {
    if (focusProductId === 0) {
      return;
    } else {
      return getData(); // Logic Below
    }
  }, [focusProductId])

  // Redirects for now to Item Page (Default set to product id: 71704)
  axios.get(`/`);

  // Main Data fetching function for whole page
  var getData = () => {

    // INIT GET General Data & Styles of target product
    useOverviewProductLogic(focusProductId, setProductInfo,
      setCurrentProductOutfitCard, setFeaturesPrimaryProduct, setProductStyles);

    // INIT GET Related Products Data
    useRelatedProductLogic(focusProductId, setRelatedProductsData);

    // INIT GET Product REVIEWS Data & Meta
    useReviewsLogic(focusProductId, setReviewList, setRating, setReviewMeta);

    // INIT GET Cart Data
    axios.get('/getCart')
      .then((response) => {
        setCartNumber(response.data.length);
      })
      .catch((err) => {
        console.log("CART GET FAILURE - ERROR: ", err)
      })
  }

  // OnClick Handlers

  var onClickYourOutfit = (data) => {
    for (var i = 0; i < yourOutfitList.length; i++) {
      if (yourOutfitList[i].current_id === currentProductOutfitCard.current_id) {
        return;
      }
    }
    setYourOutfitList((current) => {
      return [...current, currentProductOutfitCard]
    });
  }

  var onClickDeleteProductYourOutfit = (idToDelete) => {
    yourOutfitList.forEach((obj, index) => {
      if (obj.current_id === idToDelete) {
        setYourOutfitList([
          ...yourOutfitList.slice(0, index),
          ...yourOutfitList.slice(index + 1, yourOutfitList.length)
        ]);
      }
    })
  }

  var onClickNavigateToNewProductPage = (id) => {
    // console.log("NavigateToNewProductPage with id: ", id)
    setFocusProductId(id);
  }

  var onClickAddToCart = (sku) => {
    axios.post('/addToCart', { params: { sku_id: sku } })
      .then((response) => {
        // console.log("ADDED TO CART SUCCESSFUL Response: ", response);
        axios.get('/getCart')
          .then((response) => {
            setCartNumber(response.data.length);
          })
          .catch((err) => {
            console.log("CART GET FAILURE - ERROR: ", err)
          })
      })
      .catch((err) => {
        console.log("CART FAILURE - ERROR: ", err)
      })
  }

  var onClickDeleteCart = (idToDelete) => {
    axios.delete('/deleteCart')
      .then((response) => {
        // console.log("DELETE CART SUCCESSFUL: ", response);
        setCartNumber(response.data.length);
      })
      .catch((err) => {
        console.log("CART DELETE FAILURE - ERROR: ", err)
      })
  }

  // Passed as prop into Review Module
  var updateReviewList = (newReviewList) => {
    setReviewList(newReviewList);
  }

  const handleTrackClick = (target) => {
    const widgetname = target.getAttribute('widgetname');
    axios.post('/clickTrackPost', {
      element: target.tagName ? target.tagName : "null",
      widget: target.getAttribute("widgetname") ? target.getAttribute("widgetname") : "null",
      time: new Date(Date.now()).toString()
    })
    .then((response) => {
      console.log("API SUCCESSFUL Click Tracking Response: ", response);
    })
    .catch ((err) => {
      console.log("API FAILURE: Click Tracking ERROR: ", err)
    })
  }

  return (

    // <div onClick={onClickTracker}>
    <div onClick={(event)=>handleTrackClick(event.target)}>

      <Header cartNumber={cartNumber} onClickDeleteCart={onClickDeleteCart} />
      <h2 data-testid='testYourOutfitCard'>Golden Fan Shop</h2>

      <div className="initSpinnerContainer">
        <Suspense fallback={<img src={Spinner} className='initSpinner' alt="Loading..." />}>
          <Overview rating={rating} serverError={serverError} info={productInfo} styles={productStyles} onClickYourOutfit={onClickYourOutfit} onClickAddToCart={onClickAddToCart} />
        </Suspense>
      </div>

      <div className="margins-nonOverview-styling" >
        <Description slogan={productInfo.slogan} desc={productInfo.description} featuresPrimaryProductString={featuresPrimaryProduct} />
        {relatedProductsData.length > 0 ? <div className="section" widgetname="Related/YourOutfit">RELATED PRODUCTS</div> : null}
        <div widgetname="RelatedProductsCarousel" ref={relatedCarourselRef} className="sidescroller" onScroll={handleSideScroll}>
          {scrollRelatedProgress > 3.3 ? (<LeftScrollButtonCarousel moveLeft={moveLeft} />) : null}
          {relatedProductsData.map((itemObj, index) => {
            return <RelatedCard onClickNavigateToNewProductPage={onClickNavigateToNewProductPage} related_id={itemObj.related_id} related_name={itemObj.related_name}
              related_category={itemObj.related_category} related_price={itemObj.related_price}
              related_thumbnail={itemObj.related_thumbnail} {...itemObj.related_features} featuresPrimaryProductString={featuresPrimaryProduct}
              key={`slide-${itemObj.related_id}`}
              ref={index === activeSlide ? activeSlideRef : index - 1 === activeSlide ? nextSlideRef : index + 1 === activeSlide ? prevSlideRef : null} />
          })}
          {scrollToggleRelatedProgress && scrollRelatedProgress < 100 && <RightScrollButtonCarousel moveRight={moveRight} />}
        </div><br /><br />
        <div widgetname="YourOutfitCarousel" ref={loadBottomBoundary}>YOUR OUTFIT</div>
        <div ref={yourOutfitCarourselRef} className="sidescroller" onScroll={handleSideScroll2} widgetname="Your Outfit">
          <Suspense fallback={<img src={Spinner} alt="Loading..." />}>
            {scrollYourOutfitProgress > 3.3 ? (<LeftScrollButtonCarousel moveLeft={moveLeft2} />) : null}
            {yourOutfitList.map((itemObj, index) => {
              return <YourOutfitCard onClickNavigateToNewProductPage={onClickNavigateToNewProductPage} current_name={itemObj.current_name} current_id={itemObj.current_id}
                current_category={itemObj.current_category} current_price={itemObj.current_price}
                current_thumbnail={itemObj.current_thumbnail} onClickDeleteProductYourOutfit={onClickDeleteProductYourOutfit}
                key={`slide-${itemObj.current_id}`}
                ref={index === activeSlide2 ? activeSlideRef2 : index - 1 === activeSlide2 ? nextSlideRef2 : index + 1 === activeSlide2 ? prevSlideRef2 : null} />
            })}
            <AddToOutfitCard onClickYourOutfit={onClickYourOutfit} ref={activeSlide2 === yourOutfitList.length - 1 ? nextSlideRef2 : null} />
            {scrollToggleYourOutfitProgress && scrollYourOutfitProgress < 100 && <RightScrollButtonCarousel moveRight={moveRight2} l />}
          </Suspense>
        </div>
        {bottomHalfView && (
          <Suspense fallback={<img src={Spinner} alt="Loading..." />}>
            <Questions data={productQnAData} product={productInfo} />
            <Reviews rating={rating} reviewList={reviewList} meta={reviewMeta} product={productInfo} updateReviewList={updateReviewList} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default App;
