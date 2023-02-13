// modules
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import ScrollButton from '../components/ScrollButton.js';
import Footer from '../components/Footer.js';

// actions
import {
  openModal,
  closeModal,
  setProcessing,
  setSuccess,
  setFail,
  setWaiting,
} from '../features/modalSlice';

// hooks
import useCDS from '../utils/hooks/useCDS';
import useERC20 from '../utils/hooks/useERC20';

// utils
import {
  calculateTotalAssets,
  calculateClaimPrice,
  calculateDropRate,
  calculateSellerDeposit,
  calculateLiquidationPrice,
  calculatePremiumPrice,
} from '../utils/calculator';
import { onlyNumber } from '../utils/validation';
import { weeksToUnixTime } from '../utils/calendar';

// css
import '../assets/css/negotiate.css';

// imgage
import createBackGround from '../assets/img/createPage_bg.jpg';
import priceDescribe from '../assets/img/price_describe.jpeg';

function Create() {
  const CDS = useCDS();
  const ERC20 = useERC20();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Authoirization Var
  const isLogin = useSelector((state) => state.auth.isLogin);

  // CDS Creator Role => 0: Buyer, 1: Seller
  const [isBuyer, setIsbuyer] = useState(true);

  // CDS Content State Variable
  const userAddress = useSelector((state) => state.auth.user_addr);

  // Assets State Var
  const [assetType, setAssetType] = useState('0');
  const [initialPriceOfAssets, setInitialPriceOfAssets] = useState('0');
  const [amountOfAssets, setAmountOfAssets] = useState('0');
  const [totalAssets, setTotalAssets] = useState('0');

  // Claim State Var
  const [claimPrice, setClaimPrice] = useState('0');
  const [dropRate, setDropRate] = useState('0');

  // Premium State Var
  const [premiumRate, setPremiumRate] = useState(2);
  const [premiumPrice, setPremiumPrice] = useState('0');
  const [premiumInterval, setPremiumInterval] = useState('4');
  const [premiumRounds, setPremiumRounds] = useState('0');

  // Liqudation State Var
  const [sellerDeposit, setSellerDeposit] = useState('0');
  const [liquidationPrice, setLiquidationPrice] = useState('0');

  /********************/
  //     Handler      //
  /********************/

  // Create CDS Handler
  const createButtonHandler = async () => {
    const data = {
      isBuyer,
      initialPriceOfAssets,
      claimPrice,
      liquidationPrice,
      sellerDeposit,
      premiumPrice,
      premiumRounds,
      assetType,
      userAddress: userAddress
    };
    console.log(data);

    console.log({
      assetType,
      initialPriceOfAssets,
      amountOfAssets,
      claimPrice,
      liquidationPrice,
      premium: premiumPrice,
      premiumInterval,
      TotalPremiumRounds: premiumRounds,
      sellerDeposit,
    })

    try {
      // Notice Modal open
      dispatch(openModal());
      dispatch(setProcessing());

      // check input validation
      if (
        !initialPriceOfAssets
        || !claimPrice
        || !liquidationPrice
        || !sellerDeposit
        || !premiumPrice
        || !premiumRounds
        || !assetType
        || !userAddress
      ) {
        throw new Error("Not valid inputs")
      };

      // check input zero value
      if ( initialPriceOfAssets <= 0
        || amountOfAssets <= 0
        || claimPrice <= 0
        || liquidationPrice <= 0
        || sellerDeposit <= 0
        || premiumPrice <= 0
        || premiumRounds <= 0
      ) {
        throw new Error("There is a number less than zero");
      }

      // calculate deposit
      let deposit;
      if(isBuyer === true) deposit = 4 * premiumPrice;
      else deposit = sellerDeposit;

      const currentBalance = await ERC20.balanceOf(userAddress);
      console.log(currentBalance);

      // Approve Token Amount to Contract
      const approved = await ERC20.approve(deposit, userAddress);
      console.log(approved);

      // create CDS
      const result = await CDS.create(data, userAddress);
      console.log(result);

      // get SwapId
      const swapId = result.events.Create.returnValues.swapId;
      console.log(swapId);
      dispatch(setSuccess(swapId));

      // Notice Modal close
      const timeoutId = setTimeout(() => {
        dispatch(closeModal());
        dispatch(setWaiting());
        navigate('/');
      }, 3000);
    } catch (err) {
      const timeoutId = setTimeout(() => {
        dispatch(closeModal());
        dispatch(setWaiting());
      }, 3000);

      dispatch(setFail(timeoutId));

      console.log(err);
    }
  };
  
  /********************/
  //      Effect      //
  /********************/
  
  // change TotalAssets
  useEffect(() => {
    const totalAssetsCalculated = calculateTotalAssets(
      initialPriceOfAssets,
      amountOfAssets,
    );
    setTotalAssets( Number(totalAssetsCalculated) );
  }, [initialPriceOfAssets, amountOfAssets]);

  // change claimPrice, liquidationPrice, premiumPrice
  useEffect(() => {
    const claimPriceCalculated = calculateClaimPrice(
      initialPriceOfAssets,
      dropRate,
    );
    setClaimPrice( Number(claimPriceCalculated) );
    setLiquidationPrice( Number(claimPriceCalculated) );

    const premiumPriceCalculated = calculatePremiumPrice(
      initialPriceOfAssets,
      amountOfAssets,
      dropRate,
      premiumRate,
    );
    setPremiumPrice( Number(premiumPriceCalculated) );
  }, [totalAssets, dropRate, premiumRate]);


  // change sellerDeposit
  useEffect(() => {
    setSellerDeposit(
      Number( calculateSellerDeposit(
        initialPriceOfAssets,
        amountOfAssets,
        liquidationPrice,
      )),
    );
  }, [totalAssets, liquidationPrice]);

  return (
    <>
      <div className="negotiate-banner">
        <img src={createBackGround} alt="acceptBackGround" />
      </div>
      <div className="container container-negotiate">
        <div className="negotiate-head">
          <h1 className="negotiate-head-title">Propose Crypto Default Swap</h1>
          <p className="negotiate-head-notice text-xl font-semibold py-2">
            Welcome! Enter Your Details And Start Creating Crypto Default Swap!
          </p>
          <hr className="line w-[150px] color-[var(--primary-color)]" />
        </div>
        <div className="negotiate-guide">
          <img src={priceDescribe}/>
        </div>
        <div className="negotiate-form">
          <div className="form-section">
            <h2 className="section-title">User</h2>
            <div className="input-group">
              <div className="input-radio">
                <label>
                  <input
                    name="role"
                    type="radio"
                    onChange={(e) => setIsbuyer(true)}
                    defaultChecked
                  />
                  Buyer
                </label>
                <label>
                  <input
                    name="role"
                    type="radio"
                    onChange={(e) => setIsbuyer(false)}
                  />
                  Seller
                </label>
              </div>
              <div className="input-wrapper">
                <div className='input-label'>User Address</div>
                <input
                  value={userAddress}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-title">Assets</h2>
            <div className="input-group">
              <div className='input-wrapper'>
                <div className='input-label'>Assets Type</div>
                <select 
                  className='select' 
                  defaultValue={'0'}
                  onChange={e=>setAssetType(e.target.value)}
                >
                  <option value='0'>Bitcoin</option>
                  <option value='1'>Ethereum</option>
                  <option value='2'>ChainLink</option>
                </select>
              </div>
              <div className='input-wrapper'>
                <div className='input-label'>Initial Price of Assets</div>
                <div className='input-value'>
                  <input
                    value={initialPriceOfAssets.toLocaleString()}
                    onChange={(e) => {
                      const currentValue = onlyNumber(e.target.value);
                      setInitialPriceOfAssets( Number(currentValue) );
                    }}
                  />
                </div>
              </div>
              <div className='input-wrapper'>
                <div className='input-label'>The Amount of Assets</div>
                <div className='input-number'>
                  <input
                    value={amountOfAssets.toLocaleString()}
                    onChange={(e) => {
                      const currentValue = onlyNumber(e.target.value);
                      setAmountOfAssets( Number(currentValue) );
                    }}
                  />
                </div>
              </div>
              <div className='input-wrapper'>
                <div className='input-label'>Total Assets</div>
                <div className='input-value disabled'>
                  <input
                    value={totalAssets.toLocaleString()}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-title">Claim</h2>
            <div className="input-group">
              <div className='input-wrapper'>
                <div className='input-label'>Claim Price</div>
                <div className='input-value disabled'>
                  <input
                    value={claimPrice.toLocaleString()}
                    onChange={(e) => {
                      const currentValue = onlyNumber(e.target.value);
                      setClaimPrice(currentValue);
                    }}
                    disabled
                  />
                </div>
              </div>
              <div className="input-range">
                <input
                  className="value"
                  value={`Drop Rate: ${dropRate} %`}
                  disabled
                />
                <input
                  className="range"
                  type="range"
                  min="0"
                  max="100"
                  placeholder="Drop Rate"
                  value={dropRate}
                  onChange={(e) => {
                    setDropRate(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-title">Premium</h2>
            <div className="input-group">
              <div className="input-range">
                <input
                  placeholder="Premium Rate"
                  value={`Premium Rate: ${premiumRate} %`}
                  disabled
                />
                <input
                  className="range"
                  type="range"
                  value={premiumRate}
                  max={20}
                  min={0}
                  onChange={(e) => setPremiumRate(e.target.value)}
                />
              </div>
              <div className='input-wrapper'>
                <div className='input-label'>Premium Price</div>
                <div className='input-value disabled'>
                  <input
                    value={premiumPrice.toLocaleString()}
                    disabled
                  />
                </div>
              </div>
              <div className="input-select">
                <input
                  placeholder="Premium Interval"
                  value={`Premium Interval: ${premiumInterval} weeks`}
                  disabled
                />
                <select
                  placeholder="Premium Interval"              
                  defaultValue="4"
                  onChange={(e) => setPremiumInterval(e.target.value)}
                  disabled
                >
                  <option value="4">4 weeks</option>
                  <option value="8">8 weeks</option>
                  <option value="12">12 weeks</option>
                </select>
              </div>
              <div className='input-wrapper'>
                <div className='input-label'>Premium Rounds</div>
                <div className='input-number'>
                  <input
                    value={premiumRounds}
                    onChange={(e) => {
                      const currentValue = onlyNumber(e.target.value);
                      setPremiumRounds(currentValue);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <h2 className="section-title">Liquidation</h2>
            <div className="input-group">
              <div className='input-wrapper'>
                <div className='input-label'>Seller Deposit</div>
                <div className='input-value disabled'>
                  <input
                    value={sellerDeposit.toLocaleString()}
                    disabled
                  />
                </div>
              </div>
              <div className="input-range">
                <input
                  className="value"
                  placeholder="Liquidated Price"
                  value={`Liquidated Price: ${liquidationPrice.toLocaleString()}`}
                  max={claimPrice || 0}
                  onChange={(e) => {
                    const currentValue = onlyNumber(e.target.value);
                    if (Number(currentValue) > Number(claimPrice)) return;
                    else setLiquidationPrice( Number(currentValue) );
                  }}
                />
                <input
                  className="range"
                  type="range"
                  value={liquidationPrice}
                  max={claimPrice || 0}
                  min="0"
                  onChange={(e) => setLiquidationPrice(e.target.value)}
                />
              </div>
              <div className='input-wrapper'>
                <div className='input-label'>Buyer Deposit</div>
                <div className='input-value disabled'>
                  <input
                    value={Number(premiumPrice * 3).toLocaleString()}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="button-group">
              <button
                className="negotiate-button hover:bg-mintHover transition delay-80"
                onClick={createButtonHandler}
              >
                Create And Propose CDS
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-11 right-11">
        <ScrollButton />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Create;
