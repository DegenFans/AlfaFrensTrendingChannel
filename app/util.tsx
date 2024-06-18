

export async function getTrendingChannel(){
const response = await fetch(
    `https://base-mainnet.subgraph.x.superfluid.dev/`,
    {
      next: { revalidate: 3600 },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: /* GraphQL */ `
        query MyQuery {
          streams(
            orderBy: createdAtTimestamp
            orderDirection: desc
            first: 500
            where: {token: "0x1eff3dd78f4a14abfa9fa66579bd3ce9e1b30529"}
          ) {
            createdAtTimestamp
            receiver {
              id
            }
            sender {
              id
            }
          }
        }
        `,
      }),
    },
  )

  const responseData = await response.json()
  const data = responseData.data
  function order(a:any, b:any) {
    return a < b ? -1 : (a > b ? 1 : 0);
}
  const results = 
  data.streams.reduce((m:any, item:any) => {
    const key = item.receiver.id;
    return m.set(key, (m.get(key) || 0) + 1)
  },new Map());
  const newMap = Array.from(results).sort((a:any, b:any) => b[1] - a[1]);


  //console.log(newMap);
   
  return newMap.slice(0,30);
 
}

export async function getChannelInfos(ca:string){
    const response = await fetch(
        `https://alfafrens.com/api/v0/getChannel?channelAddress=`+ca,
        {
            next: { revalidate: 3600 },
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    
      const responseData = await response.json()
      return responseData
}
export async function getChannelOwner(ca:string){
    const response = await fetch(
        `https://alfafrens.com/api/v0/getChannelOwner?channelAddress=`+ca,
        {
            next: { revalidate: 3600 },
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    
      const responseData = await response.json()
      return responseData
}

export async function getImage(fid:string){
    const response = await fetch(
        `https://hubs.airstack.xyz/v1/userDataByFid?user_data_type=1&fid=`+fid,
        {
            next: { revalidate: 3600 },
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "x-airstack-hubs": process.env.AIRSTACK_API_KEY as string,
          },
        }
      )
    
      const responseData = await response.json()
      return responseData
}

