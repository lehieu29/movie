import PropTypes from 'prop-types';

import { Header } from '~/layouts/components/Header';

function Layout({ children }) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
