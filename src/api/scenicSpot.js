import axios from 'axios';
import qs from 'qs';

const tourismScenicSpotRequest = axios.create({
    baseURL: `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot`,
});

// TDX API 認證
async function getAuthorizationHeader() {
    const parameter = {
        grant_type: "client_credentials",
        client_id: process.env.VUE_APP_TDX_CLIENT_ID,
        client_secret: process.env.VUE_APP_TDX_CLIENT_SECRET
    }; 

    const auth_url = `https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token`;   

    try {
        let res = await axios({
            method: "POST",
            url: auth_url,
            data: qs.stringify(parameter),
            headers: { "content-type": "application/x-www-form-urlencoded" },
        });

        let accesstoken = res.data;
        
        return {
            authorization: `Bearer ${accesstoken.access_token}`,
        }
    } catch (err) {
        return err;
    }        
}

// 找出 特定城市中的 包含特定關鍵字的景點。
export async function getSpecifyOfLandscape (searchText="", oneCity="") {
    return tourismScenicSpotRequest.get(`${oneCity}?$filter=contains(ScenicSpotName, '${searchText}')&$format=JSON`,
        {
            headers: await getAuthorizationHeader(),
        }
    );
};

// 找出 自己附近的景點。
export async function getNearbyOfLandscape ({latitude, longitude}, distance) {
    return tourismScenicSpotRequest.get(`?$spatialFilter=nearby(${latitude}, ${longitude}, ${distance})&$format=JSON`,
        {
            headers: await getAuthorizationHeader(),
        }
    );
};

// 找出 指定編號的景點，用於 景點頁中的動態分頁。
export async function getOneLocationOfLandscape (ScenicSpotID) {
    return tourismScenicSpotRequest.get(`?$filter=contains(ScenicSpotID, '${ScenicSpotID}')&$format=JSON`,
        {
            headers: await getAuthorizationHeader(),
        }
    );
};