import { FC, useEffect } from 'react';

export interface AdBannerProps { }

const AdBanner: FC<AdBannerProps> = ({ ...props }) => {
    useEffect(() => {
        // const adsbygoogle: any = window.adsbygoogle || [];
        // if (adsbygoogle.loaded) return;

        // adsbygoogle.push({
        //     google_ad_client: 'ca-pub-4521347864074429',
        //     enable_page_level_ads: true
        // });
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log(window.adsbygoogle);


        } catch (err) {
            console.log(err);
        }
    }, []);
    // useEffect(() => {
    //     const adsElements = document.querySelectorAll('.adsbygoogle');
    //     console.log(adsElements);

    //     adsElements.forEach((element) => {
    //         if (element.hasAttribute('data-adsbygoogle-status')) {
    //             // Loại bỏ phần tử đã chứa quảng cáo
    //             element.remove();
    //         }
    //     });
    //     console.log(222, adsElements);

    //     // Thêm quảng cáo mới vào phần tử <ins>
    //     (window.adsbygoogle = window.adsbygoogle || []).push({});
    // }, []);
    // useEffect(() => {
    //     const pushAd = () => {
    //         try {
    //             const adsbygoogle: any = window.adsbygoogle
    //             console.log({ adsbygoogle })
    //             adsbygoogle.push({})
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }

    //     let interval = setInterval(() => {
    //         // Check if Adsense script is loaded every 300ms
    //         if (window.adsbygoogle) {
    //             pushAd()
    //             // clear the interval once the ad is pushed so that function isn't called indefinitely
    //             clearInterval(interval)
    //         }
    //     }, 300)

    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [])
    return (
        <ins
            className="adsbygoogle"
            style={{
                display: 'block', overflow: 'hidden', width: "500px", height: "200px"
            }}
            // data-ad-client="ca-pub-4521347864074429"
            // data-adtest="on"
            data-ad-client="ca-app-pub-3940256099942544"
            // data-ad-slot="1234567890"
            {...props}
        />
    );
};

export default AdBanner;
