import styled from "styled-components"
import { Wrapper_Auth } from "./Auth_Login"
import Auth_Header from "components/Auth_Header"
import axios from "axios"
import { tmpToken } from "./Auth_Selection"
import { useEffect, useState } from "react"
import { PLACESINFO } from "consts/places"
import { useNavigate } from "react-router-dom"

function Auth_Item(){
    const navigate=useNavigate();

    const text = "대여품 수량관리"
    const placeIdList = [1,2,3];
    const [resultList,setResultList]=useState([]);

    const fetchItem = async() => {
        let tmp = [];
        const token = sessionStorage.getItem('token');
        
        for(let i = 0; i<placeIdList.length; i++){
            console.log(token);
            try{
                const response = await axios.get(`${process.env.REACT_APP_BACK_API}/api/v1/mat`,
                {
                    headers:{
                        Authorization:token
                    },
                    params:{
                        placeId:placeIdList[i]
                    },
                });
                tmp.push(response.data.result);
                console.log(response.data);
            }catch(error){
                // alert(error);
            }
        }
        setResultList(tmp);
    }
    //resultList에 각 대여장소별 response.data.result를 모아둠

    const onClick_add = async (event) => {
        const placeId = Number(event.currentTarget.id);
        const token = sessionStorage.getItem('token');

        let tmp = window.confirm(`해당 ${placeId}번 위치에 돗자리를 추가하시겠습니까?`)
        
        if(tmp)
            try{
                //[관리자 페이지]돗자리 추가 API
                const response = await axios.post(
                    `${process.env.REACT_APP_BACK_API}/api/v1/mat/admin`,
                    {
                        placeId:placeId,
                        price:3000
                    },
                    {
                        headers:{
                            Authorization:token
                        }
                    }
                    )
                console.log(response.data);
                alert('성공적으로 추가되었습니다');
                fetchItem();
            }catch(error){
                alert(error);
            }
    }

    const onClick_delete = async (event) => {
        const placeId = Number(event.currentTarget.dataset.placeid);
        //dataset의 속성이름에 대문자 들어가면 안됨

        const id = Number(event.currentTarget.id);
        const token = sessionStorage.getItem('token');

        let tmp = window.confirm(`해당 ${placeId}번 위치의 ${id}번 돗자리를 삭제하시겠습니까?`)
        
        if(tmp)
            try{
                //[관리자] 돗자리 삭제 API
                const response = await axios.delete(
                    `${process.env.REACT_APP_BACK_API}/api/v1/mat/${id}/admin`,
                    {
                        headers:{
                            Authorization:token
                        },
                    }
                    )
                console.log(response.data);
                alert('성공적으로 삭제되었습니다');
                fetchItem();
            }catch(error){
                alert(error);
            }
    }

    useEffect(()=>{fetchItem()},[]);

    //관리자 로그인 여부//
    useEffect(()=>{
        const parsed = JSON.parse(process.env.REACT_APP_AUTH_ACCOUNT);
        const sessionItem = JSON.parse(sessionStorage.getItem('authKey'));

        if(!sessionItem ||
            (sessionItem.id !== parsed.id ||
                sessionItem.password !== parsed.password)){
                alert('관리자 로그인이 필요한 서비스입니다');
                navigate('/auth/login');
            }
    },[])

    return (
        <Wrapper_Auth>
            <Auth_Header text={text}/>
            <Top_Text>
                대여중 총 수량 : 30개
                <Spacer/>
                대여 중인 총 수량 : 10개 
            </Top_Text>
            <FullBox> 
                <RentalShopContainer>

                {resultList?.map((item,index)=>{
                    return(
                    <div key={index}>

                        <RentalShopName>
                        <RentalShopName_Text>
                            {index+1}. {PLACESINFO[index].name}(인덱스 : 돗자리 id)
                        </RentalShopName_Text>
                        </RentalShopName>
                        <RentalShopBox>
                            <IndexBox>
                                <IndexTopic>ID</IndexTopic>
                                <IndexTopic>사물함번호</IndexTopic>
                                <IndexTopic>비고</IndexTopic>
                            </IndexBox>
                            <AllLocker>
                                {item.matIdList.map((item2,index2)=>
                                <OneLocker key={index2}>
                                    <IndexNumber>{index2}</IndexNumber> | <ItemNumber>{item2}</ItemNumber>
                                    {/* PLACESINFO는 상수(프론트에서 관리하는 대여장소들 정보) */}
                                    <Delete>
                                    <DeleteButton id={index+1} onClick={onClick_delete}>
                                        돗자리 삭제
                                    </DeleteButton>
                                    </Delete>
                                </OneLocker>
                                )}
                            </AllLocker>
                            <AddButton id={index+1} onClick={onClick_add}>
                                + 돗자리 추가
                            </AddButton>
                            <Quantity>
                                <Quantity_Test>총 수량 : 5 <Spacer_2/> 대여 중인 수량 : 5</Quantity_Test>
                            </Quantity>
                        </RentalShopBox>  

                        <br/>
                    </div>
                    )
                }
            )}
            </RentalShopContainer>
        </FullBox>
    </Wrapper_Auth>
    )
}
export default Auth_Item

const Top_Text = styled.h1`
    color: #000;
    font-family: Pretendard;
    font-size: 25px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.333px;
    margin-top: 30px;
    /* margin-bottom:10px; */
`;
//span요소를 사용해서 tap한 것 처럼
const Spacer = styled.span`
    display : inline-block;
    width: 80px;
`;
const FullBox = styled.div`
    margin-top: 30px;
    margin-bottom:30px;
    
`;
const RentalShopName = styled.div`
    margin-top: 10px;
    margin-bottom:10px;
`;
const RentalShopName_Text = styled.h1`
    color: #000;
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: -0.333px;
    margin-top: 0 29px;
    margin-left:20px;
    flex:1;
`;
//각 대여소 Box를 가로로 나열하기 위해 Container 컴포넌트를 따로 만들어줬다.
const RentalShopContainer = styled.div`/*row 배치*/
    display: flex; /*부모 컨테이너와 자식 요소들(여기선 RentalShopBox)의 배치를 쉽게 제어할 수 있게 해줌!*/ 
    flex-direction: row;/*컨테이너 내의 아이템들이 가로(row)방향으로 배치되도록 함*/
    align-items: flex-start;/*Flexbox컨테이너 내의 아이템들을 세로로 어떻게 정렬할지 결정 잠 flex-start -> 아이템들을 컨테이너 시작점(위쪽)에 맞추어 정렬한다.*/
    justify-content: space-around;/*Flexbox 컨테이너 내의 아이템들을 가로 방량으로 어떻게 정렬할것인지 결정 -> 첫번째와 마지막 아이템 사이에 동일한 간격을 둔다.*/
    flex-wrap: wrap;/*컨테이너 내 item들이 크기 초과할 때 어떻게 동작하는지 결정. wawrp => 아이템들이 컨테이너 너비 초과하면 다음 줄로 이동하여 베차 -> 반응형 레이아웃*/
    width: 100%;
`;
const AllLocker = styled.div`
margin-top: 20px;
margin-bottom: 20px;
margin-right: 40px;
border-bottom:1.5px solid #000;
`;

const RentalShopBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
width: 300px;
margin: 10px;
padding: 20px;
flex-shrink: 0;
border-radius: 12px;
background: #D9D9D9;
`;

const IndexBox = styled.div`
display: flex;
flex-direction: row;
margin-right: 1px;
margin-left: 10px;
margin-top: 1px;
margin-bottom: 10px;
border-bottom: 1.5px solid #000; /* 줄 */
`;
const IndexTopic = styled.h1`
    width: 86px;
    height: 33px;
    flex-shrink: 0;
    color: var(--kakao-logo, #000);
    text-align: center;
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 133.333% */
    letter-spacing: -0.333px;
`;
const LentalState = styled.div``;

const IndexLine=styled.line``;


const IndexNumber = styled.span`
    display: flex; /* 가로로 나란히 배치 */
    margin-left: 35px; /* 공백 설정 */
    margin-right: 25px;
`;

const ItemNumber = styled.span`
    display: flex; /* 가로로 나란히 배치 */
    display: inline-block;
    margin-left: 35px; /* 공백 설정 */
    margin-right: 30px;
`;

const ID = styled.text``;
const LentalState_2 = styled.text``;
/* //취소하기 버튼 전용 span */
const Delete = styled.span`
    margin-left: auto; /* 자동으로 왼쪽 여백을 채워 버튼을 오른쪽으로 밀어냄 */
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
`;
const OneLocker = styled.div`
    display: flex; /* 가로로 나란히 배치 */
    align-items: center; /* 세로 정렬을 중앙으로 맞춤 */
    justify-content: space-between; /* 양쪽 끝으로 배치 */
    margin-right:10px;
    margin-left:10px;
    margin-bottom:10px; 
    width: 250px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 4px;
    background: #F7F7F7;
`;
const DeleteButton = styled.button`
    width: 75px;
    height: 25px;
    background-color: pink;
    color: #333; /* 폰트 색상 설정 */
`;

const Quantity = styled.div`
    margin-top:10px;
    margin-bottom:10px;
`;
const Spacer_2 = styled.span`
    display: inline-block;
    margin: 0 15px; /* 왼쪽과 오른쪽에 각각 15px 간격 */
`;
const Quantity_Test = styled.h1`
    display: flex;
width: 135px;
height: 43px;
flex-direction: column;
justify-content: center;
flex-shrink: 0;
color: var(--kakao-logo, #000);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 24px; /* 150% */
letter-spacing: -0.333px;
color: var(--kakao-logo, #000);
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 24px;
letter-spacing: -0.333px;
`;
const AddButton = styled.button`
    width:100px;
    height:20px;
    background-color:yellowgreen;
    color:white;
    margin-left:160px;
`;


