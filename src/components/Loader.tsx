/* eslint-disable react/self-closing-comp */
interface LoaderProps {
  show: boolean;
}

const Loader = ({ show }: LoaderProps) => {
  return show ? <div className='loader'></div> : null;
};

export default Loader;
