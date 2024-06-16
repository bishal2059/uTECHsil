import { Link } from 'react-router-dom';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import classes from './Home.module.css'

const HomePage = () => {
  return (
    <div
      className="h-full w-full flex flex-col justify-between"
      style={{ fontFamily: "'Exo 2', sans-serif" }}
    >
      <h1 className={classes.title}>uTECHsil</h1>
      <img src="/home.svg" alt="uTECHsil Logo"  className={classes.logo} style={{ maxHeight: '300 px' }} />
      <h2 className={classes.sub}>
        When technology meets tradition, we unlock the secrets of the past
      </h2>
      <h3 className={classes.dis}>
        Designed to preserve the rich traditional history of Nepal, our app,
        uTECHsil allows users to explore and discover the vibrant world of
        Nepali traditional utensils. Simply upload a photo or video, and
        uTECHsil will instantly identify the traditional items in the media.
        Also, providing detailed information about the items.
      </h3>
      <Link
        to={'/image'}
        className="flex flex-col items-center justify-center "
      >
        <BsFillArrowRightCircleFill className="text-4xl" />
        <span>Get Started</span>
      </Link>
    </div>
  );
};
 
export default HomePage;
