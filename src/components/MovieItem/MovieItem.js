import { useContext, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './MovieItem.module.scss';
import Image from '~/components/Image';
import { ClockIcon } from '~/components/icons';
import { Loading } from '~/components/Loading';
import { MovieContext } from '~/store/MovieContext';

const cx = classNames.bind(styles);

function MovieItem({ src = '', movie, episodes, imgBackground = false }) {
    const movieContext = useContext(MovieContext);

    const loading = !movie;

    const classNames = cx('wrapper', {
        imgBackground,
        loading: loading,
    });

    let Comp = 'div';
    let props = {};

    if (movie) {
        Comp = Link;
        props.to = '/phim/' + movie.slug;
        if (!document.location.pathname.includes('phim-da-luu')) {
            props.onClick = () => {
                movieContext.handleMovie({
                    movie,
                    episodes,
                });
            };
        }
    }

    return (
        <div className={classNames}>
            <Comp
                {...props}
                className={cx('movie__info', {
                    loading,
                })}
            >
                {loading ? (
                    <Loading noPadding={!imgBackground} delay={!imgBackground ? '5000ms' : '2500ms'} />
                ) : (
                    <>
                        <Image className={cx('movie__img')} src={src || movie.thumb_url} alt={movie.name} />

                        <div className={cx('movie__name')}>
                            <p className={cx('name__vn')}>{movie.name}</p>
                            <p className={cx('name__origin')}>{movie.origin_name}</p>
                        </div>
                        {imgBackground && <div className={cx('movie__overlay')}></div>}
                    </>
                )}
            </Comp>
            {!loading ? (
                <>
                    <div className={cx('movie__description')}>
                        <div className={cx('movie__year')}>{movie.year}</div>
                        {!document.location.pathname.includes('phim-da-luu') && (
                            <div className={cx('movie__episode')}>
                                <span>{movie.episode_current}</span>
                            </div>
                        )}
                        <div className={cx('movie__type')}>
                            {movie.type === 'series' ? 'Phim b???' : movie.type === 'single' ? 'Phim l???' : 'Ho???t h??nh'}
                        </div>
                        {!document.location.pathname.includes('phim-da-luu') && (
                            <div className={cx('movie__status')}>
                                {movie.status === 'completed' ? 'Ho??n th??nh' : 'Ch??a ho??n th??nh'}
                            </div>
                        )}
                        <div className={cx('movie__country')}>{movie.country[0].name}</div>
                    </div>
                    {imgBackground && (
                        <div className={cx('movie__time')}>
                            <ClockIcon className={cx('movie__clockIcon')} />
                            <span>
                                {movie.time
                                    .replace('1g', '1 gi???')
                                    .replace('ph??t', ' ph??t')
                                    .replace('2g', '2 gi???')
                                    .replace('1h', '1 gi??? ')
                                    .replace('2h', '2 gi??? ')
                                    .replace('Ph??t', 'ph??t')
                                    .replace('p/t???p', ' ph??t/t???p')}
                            </span>
                        </div>
                    )}
                </>
            ) : (
                ''
            )}
        </div>
    );
}

MovieItem.propTypes = {
    src: PropTypes.string,
    movie: PropTypes.object,
    episodes: PropTypes.array,
    imgBackground: PropTypes.bool,
};

export default memo(MovieItem);
