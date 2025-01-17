import QrScanner from 'components/QrScanner';
import styled from 'styled-components';

function ReturnQR() {
    return (
        <QrDiv>
            <h1>
                대여장소에 부착되어있는 QR코드를
                <br />
                아래의 화면에 맞게 촬영해주세요
            </h1>
            <QrScanner mode="return" />
        </QrDiv>
    );
}

export default ReturnQR;

const QrDiv = styled.div`
    position: relative;

    width: 100%;
`;
