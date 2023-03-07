import * as React from 'react';
import ImageRow from "./components/ImagesRow";
import {Grid} from "@mui/material";
import { useQuery, gql } from '@apollo/client';
import ImageItem from "./components/ImageItem";

const GET_ALL_USERS = gql`
    {userList {
        id, name, email, age, 
        orderList {
            id, amount, 
            item {
                category, name, price
            }
        }
    }}
`;

function DisplayUsers() {
    const { loading, error, data } = useQuery(GET_ALL_USERS);
    type User = {id: string, name: string, email: string, age: number, orderList: []}
    type Order = {id: number, amount: number, item:Item}
    type Item = {name: string, price: number}

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return data.userList.map(({ id, name, email, age, orderList } : User) => (
        <div key={id}>
            <h3>{name}</h3>
            <p>{age}</p>
            <p>{email}</p>
            {orderList.length > 0 && orderList.map((order: Order) => {
                return (
                    <div key={order.id}>
                        <p>상품 : {order.item.name}</p>
                        <p>가격 : {order.item.price}</p>
                        <p>수량 : {order.amount}</p>
                        <p>총액 : {order.item.price * order.amount}</p>
                    </div>
                );
            })}
            <br />
        </div>
    ));
}
export default function App() {
    return (
        <Grid container spacing={2}>
            <Grid item sx={{width:1000, height: 1200}} >
                <ImageRow rowNumber={0} />
                <ImageRow rowNumber={1} />
                <ImageRow rowNumber={2} />
            </Grid>
            <Grid item >
                <DisplayUsers />
            </Grid>
        </Grid>
    );
}