import { useRef, memo, useEffect } from 'react';
import classNames from 'classnames/bind';

import SliderItem from '~/components/SliderItem';
import styles from './Slider.module.scss';

const cx = classNames.bind(styles);

function Slider({ data }) {
    const slidersRef = useRef([]);

    const sliderPreviewsRef = useRef([]);

    const isLoadedImages = useRef([]);

    useEffect(() => {
        let slidersRefValue = slidersRef.current;

        let sliderPreviewsRefValue = sliderPreviewsRef.current;

        let prevIndex = 0;

        const detectClickIndex = (e) => {
            for (let i = 0; i < sliderPreviewsRef.current.length; i++) {
                if (sliderPreviewsRef.current[i].contains(e.target)) {
                    return i;
                }
            }

            return -1;
        };

        const handleChangeSlideShow = (e) => {
            const index = detectClickIndex(e);

            if (index !== -1) {
                slidersRef.current[prevIndex].style.display = 'none';

                sliderPreviewsRef.current[prevIndex].classList.remove(cx('active'));

                slidersRef.current[index].style.display = 'flex';

                sliderPreviewsRef.current[index].classList.add(cx('active'));

                prevIndex = index;
            }
        };

        const handleOnLoadedImage = (e) => {
            isLoadedImages.current = [...isLoadedImages.current, true];
        };

        if (data.length) {
            // Init
            slidersRef.current[0].style.display = 'flex';
            sliderPreviewsRef.current[0].classList.add(cx('active'));

            slidersRef.current.forEach((slide) => {
                const imageElm = slide.firstChild.firstChild;

                if (imageElm.complete) {
                    isLoadedImages.current = [...isLoadedImages.current, true];
                }

                imageElm.addEventListener('load', handleOnLoadedImage);
            });

            sliderPreviewsRef.current.forEach((itemPreview) => {
                itemPreview.addEventListener('click', handleChangeSlideShow);
            });
        }

        // hover slider -> không chuyển slide
        let isHoverSlide = false;
        let handlerAutoChangeSlide = setInterval(() => {}, Infinity);

        const handleHoverSlide = () => {
            if (!isHoverSlide) {
                isHoverSlide = true;

                const playWrapper = slidersRef.current[prevIndex].lastElementChild;

                playWrapper.classList.add(cx('rounded'));
            }
        };

        const handleLeaveSlide = () => {
            if (isHoverSlide) {
                isHoverSlide = false;

                const playWrapper = slidersRef.current[prevIndex].lastElementChild;

                playWrapper.classList.remove(cx('rounded'));
            }
        };

        if (data.length) {
            slidersRef.current.forEach((slide) => {
                slide.addEventListener('mouseover', handleHoverSlide);
            });

            slidersRef.current.forEach((slide) => {
                slide.addEventListener('mouseleave', handleLeaveSlide);
            });

            // Auto next slide
            handlerAutoChangeSlide = setInterval(() => {
                if (!isHoverSlide && isLoadedImages.current.length === 4) {
                    let indexSlideNext = prevIndex + 1;

                    if (indexSlideNext > 3) {
                        indexSlideNext = 0;
                    }

                    sliderPreviewsRef.current[indexSlideNext].click();
                }
            }, 3000);
        }

        return () => {
            sliderPreviewsRefValue.forEach((item) => {
                if (item) {
                    item.removeEventListener('click', handleChangeSlideShow);
                }
            });

            slidersRefValue.forEach((slide) => {
                if (slide) {
                    const imageElm = slide.firstChild.firstChild;

                    imageElm.removeEventListener('load', handleOnLoadedImage);
                }
            });

            slidersRefValue.forEach((item) => {
                if (item) {
                    item.removeEventListener('mouseover', handleHoverSlide);
                    item.removeEventListener('mouseleave', handleLeaveSlide);
                }
            });

            clearInterval(handlerAutoChangeSlide);
        };
    }, [data.length]);

    return (
        <>
            <div className="row">
                {data.map((item, index) => {
                    return (
                        <SliderItem
                            key={item.movie._id}
                            movie={item.movie}
                            episodes={item.episodes}
                            ref={(elm) => {
                                slidersRef.current[index] = elm;
                            }}
                        />
                    );
                })}

                {!data.length && <SliderItem show />}
            </div>

            <div className="row">
                <div className={cx('wrapper')}>
                    {data.map((item, index) => (
                        <div key={item.movie._id} className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem
                                        preview
                                        show
                                        movie={item.movie}
                                        episodes={item.episodes}
                                        ref={(elm) => {
                                            sliderPreviewsRef.current[index] = elm;
                                        }}
                                    />
                                </div>
                                <div className={cx('item__order')}>{'0' + (index + 1)}</div>
                            </div>
                        </div>
                    ))}

                    {!data.length && [
                        // Show slider preview loading
                        <div key="1" className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem show preview />
                                </div>
                            </div>
                        </div>,
                        <div key="2" className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem show preview />
                                </div>
                            </div>
                        </div>,
                        <div key="3" className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem show preview />
                                </div>
                            </div>
                        </div>,
                        <div key="4" className="col l-3">
                            <div className={cx('item__preview')}>
                                <div className="row">
                                    <SliderItem show preview />
                                </div>
                            </div>
                        </div>,
                    ]}
                </div>
            </div>
        </>
    );
}

export default memo(Slider);
