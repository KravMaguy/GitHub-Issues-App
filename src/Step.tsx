export interface StepProps {
  step: number;
}

const Step: React.SFC<StepProps> = ({ step }) => {
  return (
    <div key={step} className="scale-up zoom">
      {step}
    </div>
  );
};

export default Step;
