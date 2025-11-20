/* eslint-disable react/prop-types */
const Error = ({ message }) => {
  if (!message) return null;
  return <span className="text-sm text-red-400">{message}</span>;
};

export default Error;
