import ReCAPTCHA from "react-google-recaptcha"

interface Iprops {
  onChange?: (token: any) => any
  onError?: () => any
}

export default function Recaptcha ({ onChange, onError} : Iprops) {

  const onChangeHandler = (val : string) => onChange && onChange(val)
  const onErrorHandler = () => onError && onError()

  return (
    <div className="recaptcha_container"
      style={{
        marginTop: 6,
        marginBottom: 6
      }}
    >
      <ReCAPTCHA
        sitekey="6LcTJ4sdAAAAACwWNFO2tL3HkfL1on3UvxX3xNVM"
        onChange={onChange}
        onErrored={(onError)}
      />
    </div>
  );
};