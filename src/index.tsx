import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import store from './app/store';
import {Provider} from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

const client = new ApolloClient({
    uri: 'http://localhost:8080/api',
    cache: new InMemoryCache(),
});

root.render(
    <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Provider store={store}>
                <App />
            </Provider>
        </ThemeProvider>
    </ApolloProvider>
);