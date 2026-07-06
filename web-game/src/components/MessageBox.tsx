type MessageBoxProps = {
  success: string;
  errors: string[];
};

export default function MessageBox({
  success,
  errors,
}: MessageBoxProps) {
  return (
    <section className="panel validation-panel">

      {success && (
        <div className="success-box">
          {success}
        </div>
      )}

      {errors.map((error) => (
        <div className="error-box" key={error}>
          {error}
        </div>
      ))}

    </section>
  );
}