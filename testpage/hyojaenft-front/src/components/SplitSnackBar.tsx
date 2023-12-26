import styled from "styled-components";

const StyledSnackbar = styled.div`
  align-items: center;
  background-color: #979797d9;
  border-radius: 20px;
  display: inline-flex;
  gap: 20px;
  padding: 10px 20px;
  position: fixed;
  top: 30;

  & .label {
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 10px;
    position: relative;
  }

  & .icon {
    height: 20px;
    position: relative;
    width: 20px;
  }

  & .text {
    height: 16px;
    margin-right: -2px;
    position: relative;
    width: 354px;
  }

  & .text-wrapper {
    color: var(--bluesplit-main-blue-01);
    font-family: "Inter-Regular", Helvetica;
    font-size: 13px;
    font-weight: 400;
    height: 16px;
    left: 0;
    letter-spacing: 0;
    line-height: normal;
    position: absolute;
    top: 0;
  }

  & .button {
    all: unset;
    align-items: center;
    background-color: #252525d9;
    border-radius: 12px;
    box-sizing: border-box;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 10px;
    padding: 4px 26px;
    position: relative;
  }

  & .div {
    color: var(--bluesplit-main-blue-01);
    font-family: "Inter-Medium", Helvetica;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: normal;
    margin-top: -1px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
  }
`;

export const SplitSnackBar:React.FC = () => {
  return (
    <StyledSnackbar>
      <div className="label">
        <img className="icon" alt="Icon" src="icon.png" />
        <div className="text">
          <p className="text-wrapper">Reward registration for you and your referrer is complete.</p>
        </div>
      </div>
      <button className="button">
        <div className="div">Check</div>
      </button>
    </StyledSnackbar>
  );
};
