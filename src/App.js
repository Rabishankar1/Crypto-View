import './App.css';
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { CircularProgress, Rating } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CryptoTable from './CryptoTable';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/system';



function App() {
  const [coinsData, setCoinsData] = useState([]);
  const [markets, setMarkets] = useState({});
  const [sort, setSort] = useState({ marketCap: '', priceChange1d: '', change: '' });
  const [pageLoading, setPageLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };


  useEffect(() => {

    async function fetchData() {
      setPageLoading(true);
      let response = await axios.get('https://api.coinstats.app/public/v1/coins');
      setCoinsData(response.data.coins)
      setPageLoading(false);
    }
    fetchData();

  }, [])


  const handleClick = async coinId => {
    if (!markets[coinId]) {
      let response = await axios.get(`https://api.coinstats.app/public/v1/markets?coinId=${coinId}`);
      setMarkets({ ...markets, [coinId]: response.data });
    }
  }

  const handleMarketSort = () => {
    const data = [...coinsData].sort((a, b) => {
      if (sort.marketCap !== 'descending') {
        setSort({ marketCap: 'descending', priceChange1d: '', price: '' });
        return (b.marketCap - a.marketCap)
      }
      else {
        setSort({ marketCap: 'ascending', priceChange1d: '', price: '' });
        return (a.marketCap - b.marketCap)
      }
    })
    setCoinsData(data);
  }
  const handlePriceSort = () => {
    const data = [...coinsData].sort((a, b) => {
      if (sort.price !== 'descending') {
        setSort({ price: 'descending', marketCap: '', priceChange1d: '' });
        return (b.price - a.price)
      }
      else {
        setSort({ price: 'ascending', marketCap: '', priceChange1d: '' });
        return (a.price - b.price)
      }
    })
    setCoinsData(data);
  }

  const handleChangeSort = () => {
    const data = [...coinsData].sort((a, b) => {
      if (sort.priceChange1d !== 'descending') {
        setSort({ priceChange1d: 'descending', marketCap: '', price: '' });
        return (b.priceChange1d - a.priceChange1d)
      }
      else {
        setSort({ priceChange1d: 'ascending', marketCap: '', price: '' });
        return (a.priceChange1d - b.priceChange1d)
      }
    })
    setCoinsData(data);
  }

  const handleFavorites = (item) => {
    let index = favorites.findIndex(i => i.id === item.id);
    if (index !== -1) {
      let fav = [...favorites];
      fav.splice(index, 1);
      setFavorites(fav);
    }
    else setFavorites([...favorites, item])
  }


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light"
        style={{ paddingLeft: "10vw", paddingRight: "10vw", display: "flex", justifyContent: "space-between" }}>
        <a className="navbar-brand" href="#">Navbar</a>
        <button className='favorites' onClick={handleOpen}>Favorites</button>
      </nav>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ paddingBottom: "10px" }}>
            Favorites
          </Typography>
          {favorites.length ?
            favorites.map(item => (
              <div className='icon-wrapper' style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px" }}>
                <div className='icon-img-wrapper'><img src={item.icon} alt="item.name" /></div>
                <div>{item.name}</div>
                <div className='symbol' >{item.symbol}</div>
              </div>
            ))
            : <Typography>No Favorites Added</Typography>}
        </Box>
      </Modal>

      <div className='banner'></div>
      <div className="App">
        <h1 className='main-heading'>Crypto Markets, Prices and News</h1>
        {coinsData.length ?
          (<div>
            <div className='heading'>
              <div className="rank heading-item">Rank</div>
              <div className="name heading-item">Name</div>
              <div className="price sort heading-item" onClick={() => handlePriceSort()}>
                Price
                {sort.price === 'descending' ? <ArrowDropDownIcon /> : sort.price === 'ascending' ? <ArrowDropUpIcon /> : ''}
              </div>
              <div className="market-cap sort" onClick={() => handleMarketSort()}>
                Market cap
                {sort.marketCap === 'descending' ? <ArrowDropDownIcon /> : sort.marketCap === 'ascending' ? <ArrowDropUpIcon /> : ''}
              </div>
              <div className="volume heading-item">Volume</div>
              <div className="supply heading-item">Supply</div>
              <div className="change sort heading-item" onClick={() => handleChangeSort()}>
                % Change(24hr)
                {sort.priceChange1d === 'descending' ? <ArrowDropDownIcon /> : sort.priceChange1d === 'ascending' ? <ArrowDropUpIcon /> : ''}
              </div>
            </div>
            {coinsData.map((item, index) => (
              <Accordion key={item.id}>
                <AccordionSummary onClick={() => handleClick(item.id)}>
                  <div className='star'>
                    <Rating name="simple-controlled" onChange={() => handleFavorites(item)}
                      disabled={favorites.find(i => i.id === item.id) || favorites.length < 3 ? false : true}
                      value={favorites.find(i => i.id === item.id) ? 1 : 0}
                      max={1}
                    />
                  </div>
                  <div className='header'>
                    <div className='rank'>{item.rank}</div>
                    <div className='icon-wrapper'>
                      <div className='icon-img-wrapper'><img src={item.icon} alt="item.name" /></div>
                      <div>
                        <div>{item.name}</div>
                        <div className='symbol'>{item.symbol}</div>
                      </div>
                    </div>
                    <div>{item.price}</div>
                    <div className='market-cap'>{item.marketCap}</div>
                    <div className='volume'>{item.volume}</div>
                    <div className='supply'>{item.availableSupply}</div>
                    <div className='change'>{item.priceChange1d}</div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {markets[item.id] ?
                    <CryptoTable list={markets[item.id]} />
                    : <Suspense fallback={<CircularProgress />}>
                      <CircularProgress />
                    </Suspense>}
                </AccordionDetails>
              </Accordion>

            ))}
          </div>)
          :
          pageLoading ? <CircularProgress /> :
            <h1>No data to display</h1>}
      </div>
    </div>
  );
}

export default App;
