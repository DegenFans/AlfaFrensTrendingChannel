/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import {getTrendingChannel,getChannelInfos,getChannelOwner,getImage} from '../../util'
 

import { readFileSync } from 'fs';
import path from 'path';
let pathAssets=path.join(process.cwd(), 'assets');
const localFont =   readFileSync(path.join(pathAssets,'GeistMono-Regular.ttf'));
//console.log(localFont);
type State = {
  data: string[][],
  offset:number
}
const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/api',
  initialState: {
    data:null,
    offset: 0
  },
  imageOptions: {
    emoji:'noto'
    /* Other default options 
    fonts: [
   
      {
        name: 'geistmono',
        data: localFont,
      },
    ],*/
  },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', async(c) => {
  const { buttonValue, inputText, status,deriveState } = c
  const fruit = inputText || buttonValue

  return c.res({
    image: (
      <div
   
  style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(to top, #effee7, #8cfb51)',
    color:'#0400f5',
    fontSize: 110,
  fontFamily:'"geistmono"',
    fontWeight: 600,
    border: 'dashed 10px'
  }}
>
  <img style={{width:'150px',border:'dashed 5px',borderRadius:'50px'}} src="https://alfafrens.com/icon-144-rounded.png"/>
  <div   style={{ marginTop: 40 }}>trending channel</div>
  <div   style={{ marginTop: 20,    fontSize: 40, }}>last 1,000 actions</div>
</div>

    ),
    intents: [
      <Button value="view" action='https://f.hellwach.io/farcaster/framegame/action/?method=af-ad&next=hide+ad&nurl=https%3A%2F%2Fdegenfans.vercel.app%2Fapi%2Fview'  >View</Button>,
     ],
  })
}, {
  fonts: [  {
    name: 'geistmono',
    data: localFont,
  }]
})


app.frame('/view', async(c) => {
  const { buttonValue, inputText, status,deriveState } = c
  const fruit = inputText || buttonValue

  let state = deriveState();
  if(state.data==null){
    const data= await getTrendingChannel();
     state = deriveState(previousState => {
      previousState.data=data as string[][]
    })
    //console.log('added');
    //console.log(data);
    state.data=data as string[][];
  }

  state = deriveState(previousState => {
 
    if (buttonValue === 'back') previousState.offset--
    if (buttonValue === 'next') previousState.offset++
    if (previousState.offset<0) previousState.offset=0
  })



  //console.log(state.data);
  const afdata= await   Promise.all([getChannelInfos(state.data[state.offset][0]),getChannelOwner(state.data[state.offset][0])]);
  const cadata=afdata[0]; 
  const caownerdata=afdata[1]; 
  //console.log(caownerdata);
  const pfp=await getImage(caownerdata.users.fid);
  //console.log(pfp);
  //console.log(cadata);
  return c.res({
    image: (
      <div
   
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(to top, #effee7, #8cfb51)',
        color:'#0400f5',
        fontSize: 90,
        fontFamily:'"geistmono"',
        fontWeight: 600,
        border: 'dashed 10px'
      }}
    >
      <img style={{width:'150px',border:'dashed 5px',borderRadius:'50px'}} src={pfp.data.userDataBody.value}/>
      <div   style={{ marginTop: 30 }}>{cadata.title}</div>
      <div   style={{ marginTop: 30 , fontSize: 50,}}>{'new subs: '+state.data[state.offset][1]+''}</div>
    </div>
    ),
    intents: [
     <Button value="back" >←</Button>,
     <Button value="next" >→</Button>,
     <Button.Link href={'https://www.alfafrens.com/channel/'+state.data[state.offset][0]} >Channel</Button.Link>,
    ],
  })
}, {
  fonts: [  {
    name: 'geistmono',
    data: localFont,
  }]
})



devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
