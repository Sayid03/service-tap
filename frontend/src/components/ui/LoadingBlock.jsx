export default function LoadingBlock({ text = "Loading..." }) {
    return (
      <div className="card centered-block">
        <p>{text}</p>
      </div>
    );
  }