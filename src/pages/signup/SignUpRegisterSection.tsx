import CustomInput from "../../components/common/Input";
import FormActionButton from "../../components/common/FormActionButton";

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  walletAddress: string;
  onWalletChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  isSignUpCompleted: boolean;
};

const SignUpRegisterSection = ({
  email,
  onEmailChange,
  walletAddress,
  onWalletChange,
  name,
  onNameChange,
  onSubmit,
  isPending,
  isSignUpCompleted,
}: Props) => (
  <>
    <CustomInput
      name="email"
      placeholder="한성대 이메일 (@hansung.ac.kr)"
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
    />
    <CustomInput
      name="walletAddress"
      placeholder="지갑 주소"
      value={walletAddress}
      onChange={(e) => onWalletChange(e.target.value)}
    />
    <p className="max-w-[320px] text-xs text-gray-400 -mt-2">
      가입 완료 후 메타마스크 주소로 바뀌며 대소문자가 섞여 보일 수 있습니다. 같은 주소입니다.
    </p>
    <CustomInput
      name="name"
      placeholder="이름"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
    />

    <FormActionButton onClick={onSubmit} disabled={isPending || isSignUpCompleted} tone="blue">
      {isSignUpCompleted ? "회원가입 완료" : isPending ? "처리 중..." : "회원가입"}
    </FormActionButton>
  </>
);

export default SignUpRegisterSection;
