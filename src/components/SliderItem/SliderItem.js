import { useContext, memo, forwardRef } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './SliderItem.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images';
import { Loading } from '~/components/Loading';
import { MovieContext } from '~/store/MovieContext';

const cx = classNames.bind(styles);

const SliderItem = forwardRef(
    (
        {
            movie,
            episodes = [
                {
                    server_data: [],
                },
            ],
            preview = false,
            show = false,
            active = false,
            className,
        },
        ref,
    ) => {
        const movieContext = useContext(MovieContext);

        const loading = !movie;

        let isMovieAdult;
        if (!loading) {
            isMovieAdult = (() => {
                for (let i = 0; i < movie.category.length; i++) {
                    if (movie.category[i].name.includes('18+')) {
                        return true;
                    }
                }
            })();
        }

        let Comp = 'div';
        let props = {};

        if (movie && !preview) {
            Comp = Link;
            props.to = '/phim/' + movie.slug;
            props.onClick = () => {
                movieContext.handleMovie({
                    movie,
                    episodes,
                });
            };
        }

        const classNames = cx('wrapper', {
            show,
            preview,
            active,
            noLoading: !loading,
            [className]: !!className,
        });

        return (
            <div className={classNames} ref={ref}>
                <Comp {...props} className={cx('poster') + ' col l-4'}>
                    {loading ? (
                        <Loading preview={preview} />
                    ) : isMovieAdult ? (
                        ''
                    ) : (
                        <Image className={cx('poster__img')} src={movie.thumb_url} alt={movie.name} />
                    )}
                </Comp>
                <div className={cx('details') + ' col l-6 l-o-1'}>
                    <div className={cx('movie__name')}>
                        {loading ? <Loading marginBottom="24px" /> : isMovieAdult ? 'Phim b??? ???n' : movie.name}
                    </div>
                    <div className={cx('movie__description')}>
                        <div className={cx('movie__description__content')}>
                            {loading ? (
                                <Loading marginBottom="32px" />
                            ) : isMovieAdult ? (
                                ''
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: movie.content }}></span>
                            )}
                        </div>

                        {!isMovieAdult && (
                            <div className={cx('description__more')}>
                                <div className={cx('des__more__content')}>
                                    {loading ? (
                                        <Loading marginBottom="12px" />
                                    ) : episodes[0].server_data.length > 1 ? (
                                        'Phim b???: ' +
                                        (movie.status === 'completed'
                                            ? (movie.episode_total || movie.episode_current) + ' (Ho??n th??nh)'
                                            : movie.episode_current + ' (Ch??a ho??n th??nh)')
                                    ) : episodes[0].server_data[0].link_embed ? (
                                        movie.episode_total.includes('1 t???p') || movie.type === 'single' ? (
                                            'Phim l???'
                                        ) : (
                                            'Phim b???: T???p 1'
                                        )
                                    ) : (
                                        'Phim b???: Trailer'
                                    )}
                                </div>

                                <div className={cx('movie__duration')}>
                                    {loading ? (
                                        <Loading marginBottom="12px" />
                                    ) : movie.time ? (
                                        'Th???i gian: ' +
                                        movie.time
                                            .replace('1g', '1 gi???')
                                            .replace('ph??t', ' ph??t')
                                            .replace('2g', '2 gi???')
                                            .replace('1h', '1 gi??? ')
                                            .replace('2h', '2 gi??? ')
                                            .replace('1H', '1 gi??? ')
                                            .replace('Ph??t', 'ph??t')
                                            .replace('p/t???p', ' ph??t/t???p') +
                                        ((movie.type === 'series' || movie.type === 'hoathinh') &&
                                        !movie.time.includes('/t???p')
                                            ? '/t???p'
                                            : '')
                                    ) : (
                                        'Th???i gian: N/A'
                                    )}
                                </div>

                                <div
                                    className={cx('movie__genre', {
                                        loading,
                                    })}
                                >
                                    {loading ? (
                                        <Loading />
                                    ) : (
                                        'Th??? lo???i: ' + movie.category.map((genre) => genre.name).join(', ')
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {loading || isMovieAdult ? (
                    ''
                ) : (
                    <Comp {...props} className={cx('play__wrapper')}>
                        <div className={cx('play__border')}>
                            <div className={cx('play__btn')}>
                                <Image src={images.playBtn} alt="Play" />
                            </div>
                        </div>
                    </Comp>
                )}
            </div>
        );
    },
);

SliderItem.propTypes = {
    movie: PropTypes.object,
    episodes: PropTypes.array,
    preview: PropTypes.bool,
    show: PropTypes.bool,
    active: PropTypes.bool,
};

export default memo(SliderItem);
