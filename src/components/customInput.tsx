import OtpInput from "react-otp-input";

export type Props = {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
  className?: string;
};

const CustomInputPin = ({ value, valueLength, onChange, className }: Props) => {
  return (
    <div className= {className}>
      <OtpInput
        value={value}
        inputStyle={{
          width: "79px",
          marginRight: "40px",
          color: "#FF8A25",
          height: "70px",
          border: `1px solid #FF8A25`,
          textAlign: 'center',
          fontSize: '16px',
          borderRadius: '8px',
        }}
        onChange={onChange}
        numInputs={valueLength}
        renderInput={(props) => <input {...props} type="text" />}
      />
    </div>
  );
};

export default CustomInputPin;
