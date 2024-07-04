const Message = ({ text, error }) => {
  return (
    <div
      style={{
        backgroundColor: error ? "#f99" : "#9f9",
        marginBottom: 4,
      }}
    >
      {text}
    </div>
  );
};

export default Message;
