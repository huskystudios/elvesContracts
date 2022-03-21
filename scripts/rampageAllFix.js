const hre = require("hardhat");


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

let txHashArray = [

"0x1f0d840f16dcc8d463684efd06025edac778118d2e74a094ccb1b64e303d0441",
"0xf12519563aa213f405dcad91743acfe92477fd74327a10c405df2f14541eaa94",
"0xd7356c8e6a0544a0aee83e5ca2aa993c9e4f07a450a8eb58ab304162ff9a833a",
"0x6e6b113c04f3b567e7d95ffd89059f1e05a6f559246ff081f7efa7f0c369db53",
"0x16e593aeecd01e24d8393a9a9e9e0708d4d62ce8bab34f19d039bd70a991bc99",
"0x8b6c5d75fc4443cd7e0cba3babb253347ff7316327718b03aa4fc00350925cce",
"0x5c56b5f1818a58d8970b6e519d4506767e9570bc5e20ed46fa2e3bca5e3cc649",
"0xb48459fa6230c10e43517cdf211278f2715471e9469f9f5f8b9d9a7653d3fd16",
"0x8c78e43c307bf2eacb7ef582690674a42dd2f962e89a368595387b5f903d2927",
"0x2978def3d3a22e063514682fe7b1da5b328b6a0ea2c392832b1c82d0fea4e262",
"0xbf903244af0fc4a73f807786f1333bcda0a1d8a3dd043b3b1ab13795df1ef416",
"0x19fcf4ea635616e4d92143992f53ddd07162f7c77fd0fbaf2baa34cd4d912587",
"0xcf14fbc2a415362fb18a1f64491243407b86541cae97a6fc38402a5ae2ed0e82",
"0x56eb6e851e677d8659671b01a64d0257f812397ff58c8d25fd02ba5b856a0310",
"0x257a6b386b4dbad3c2632a79a23c7b6015345047bb263fad945316d4361013b9",
"0x46ddfd5aac571a0be5e104e259b2970d2b698f10eddb1a4f6c75456305e8b243",
"0xedfd14e6509c478c8bc9780a91fe52bd5c798aab3b11d7e8dd3e1382785f9aa4",
"0x7b9c766e65ae10b7959fc75164c079156ff9fa56388d59ea0ce05f6674592cd5",
"0xef9eb9eed547c39653f4fdf3d4912c766e6076b485e70c08037e0157801c92f7",
"0xf6ea6cbd742007056fc4cf08c6ac9caaa73667146a1b6e8dd69b99abff7c2fcc",
"0xbe536a82912b14cd92b267fb24e8d4a51147af9159a41dbcc9abf195d7a1f32d",
"0x9d727c95e63d69df615b0604dc53a7f446db90c13ade56ac1ed53efe629be979",
"0x7cbdca7dd2381af8adf6e0a192d17d2dd2b767a0761a40ff15101a91bb0ec2cd",
"0x8fcd16de06f330ec552b5b415376a1e1b53d2ac16ebf8cd3a8502486015c7d56",
"0x601b224ad1e5a506e6c3a49f84223dfaf063856d671ce564f2762285408a4b75",
"0xc024df775c84f122d1387012f57236b276b5aa5f106b7e2d132b33d046602650",
"0x7344ba1f28b05b729349d8cab9b3da6affd54d489ca93d889f2e66f689609699",
"0x048e63f18b8f654117667748710c013f1e42c9dfab1ca24000eb09f178d215d1",
"0xf89c0fd087740055be7ba513940cd996aed745e7283459b06606e9919c4a21db",
"0xf93ae358e7ee3cb29d4c08c40720f48fb7a5c41032c0b80b5d31ab9f5fbbffe3",
"0x03940e019883ca3f56c7d0c47815b58c40ee296642b6ea61909f7203cbea456f",
"0xe5a68e6d2f7a4417a8071067a2fffa31224144008ef0e058550ec3fa3fbb8909",
"0xb06be3571ac2a17fd44ab5fdbdcff05bfd1aa7b1037ff5d9e4df87a1b8294ca5",
"0x70bdfee1f834ac8d16b42f6b45a34c8f6bb7bf9b8ccfc684ec610035c056b38f",
"0xeac0de91198f660f4672a3bacf8b1d121b561ccacae6209779fad25bb2509b51",
"0xe6a5bf150757eec53bfa0e2cd13505b2fe204c4196647c60dded31b3062dd74a",
"0xe962b66b91bd798cb45189255344d50f39ab991ae48778f2aa4da694e9f75300",
"0xac0aa7cb6dc4c5d1cf71bcb75d11943fa9c0b1122420fbbeb8572511014b16a2",
"0x78ab3a065d3a0fff5347126dac30f80098085ef73b92c6047dc7fffbe441471c",
"0x3071b5ac84eec9c04e4567df1e7cfdd50084acc1cc76c950503e6351434ad6cd",
"0x59f75e733ca91002aa2415a5cae3a0c96c12dcfdadf449af25f92026c9e87912",
"0x3bcfc8e72bd5e626727d6c56f6774d870991d994e458ccc4d4988975ff2e7c63",
"0x82d3ecbd0b0443234bc7b7a95d406300740be3392a8cff4d9ae3b1659cc3735b",
"0xd83e693899e789950fe787031fea713cef08a13989a7c050c8a89317ad00debb",
"0xd5510cef99fd125a26c5a353f867e4285cb4f8b67a935c7e1fb34b4968180014",
"0x14da53f937a8b03cb3aa12b550e540fd858e1f1e3035716f4741bf154649b471",
"0xed524e695ab41e3fe8cb9953e9c18f8b9cc1f735b20db1d9b9fcbbc119016bcc",
"0x94d52704777a703f782dccf024a04b6df6a285066540040a2e4f49f6ccb64237",
"0xd7f17c4fe38c4d101c9247aa7baf9e197fc55c508026269ae7dccb144f4eeddb",
"0xee388dc88c87e6a90b368c6ad622df8db363aee77dddb84764afc5325e86dffc",
"0x32073cc6bcd638dde3a55d3fb34a33970fafccdb5c078d22d9293f21f0987c5d",
"0x158ece09afd8112a4e2d5ad7b77093bd127c76a98bab2334d47a5640abc6cd5f",
"0x624ef10f39d5cd2d54728a1498a54f2b6e2220ab89df5fe01a85dd73a6db0c25",
"0xe1fa5bccb762917d60262349e7afc75304f4210a631f4fd581004f54ebd84ee2",
"0xd38a8f725cc3ec52596aa64055c6a952e15805f6f91417f76c13256ac0d4f6fb",
"0xb0b8617877e63d5721eed1afac76ed889f50ceb7b65d7bc3ca422f43c16c8035",
"0x9786914948fdf0198c89c4d09a4fc2b75a7473c93f1fa1df165de6a3128e6cdb",
"0xdd0c4fe37d78f20f0216392f37165c8d365e99210b60d0bebf142bec6fe2117b",
"0x574bf7debcaec01d6a6feeee0c8f5c2de58d8dbe4770c7b8c9a6fe7026764afa",
"0xfc5c1fbdc4d7746cbe08a6c6f5a837a6eb2dbd8231ad3e671c57de4065ed5939",
"0x2d79e8301fd2b9819226e12bc394bd9500c8562fc1ad270ebfe83dca712cfe4e",
"0x7e1c0825b53abd95a497f075e46d95cfcfc909fb1f481d57a1219a77b5668321",
"0x794a3fedc92d573e4cb924cefab3e1e43c0abf82c23ba817a1856a6e82047e92",
"0x369a5079a3eebe1e9e777a0f4073c06757094cddff29d4eee49a93f65737714c",
"0xc774e5266c4032a36e9518e5bde5917e9a5b541843619117e6f65a2c9840194c",
"0x8e4c3bf057c4112a28428e63de988b1c73db3bdb7a2404b8c32cb129cedf3310",
"0x74fd4c31b7a9a05146c95884309dd31238967cbc8287ada33fb5a55e2a826c73",
"0x3830bb50669a27df42a3b4b7e264eb983ecf37ac9c9d5c275bf8450aa6f31f29",
"0x978ffe04491736249db60a1155c38c6a138ed58eee1ca8640d23ed6cad44e0a8",

  
];

const fixAxaTokens = [

  "75",
  "244",
  "262",
  "260",
  "470",
  "473",
  "581",
  "729",
  "1337",
  "1864",
  "1951",
  "1954",
  "1994",
  "2211",
  "2281",
  "2369",
  "2901",
  "3077",
  "3421",
  "3664",
  "3755",
  "3823",
  "3858",
  "3939",
  "4101",
  "4660",
  "5013",
  "5036",
  "5048",
  "5122",
  "5249",
  "5263",
  "5287",
  "5582",
  "5664",
  "5767",
  "5895",
  "6028",
  "6173",
  "6344",
  "6345",
  "6402",
  "6443",
  "6448",
  "6489",
  "6510",
  "6650"  
]

const fixRenlost = [

    {wallet:"0x9c5a35728c602e1ca275c6d2ccd4622346db8752" , amount: "7475000000000000000000"},
    {wallet:"0x6b6e113d56278355ed94d5aac9ace11089cacd70" , amount: "470000000000000000000"},
    {wallet:"0x0457bdd7d70c82f4cb1c850bd49064a544630978" , amount: "6748000000000000000000"},
    {wallet:"0x34db35639eafe2712ae1f69dfa298b06a5c25053" , amount: "3819000000000000000000"},
    {wallet:"0xba9479f2deadc47bb5dbc480e1656dc207b5cb13" , amount: "1100000000000000000000"},
    {wallet:"0xbbda94c23d4d5ba3e593cdc3eb41177ee07e1e92" , amount: "1200000000000000000000"},
    {wallet:"0x81e1b5163cfad14662dfb133554f3f4be8e60b5c" , amount: "1731000000000000000000"},
    {wallet:"0x81a5e042883457b01554d8d919a01847a5a68ad4" , amount: "2183000000000000000000"},

]


const fixWeapons = [
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:80},
{weaponTier: 3, weaponIndex: 7, ap: 12, tokenId:180},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:418},
{weaponTier: 3, weaponIndex: 7, ap: 12, tokenId:874},
{weaponTier: 3, weaponIndex: 7, ap: 12, tokenId:1062},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:1180},
{weaponTier: 3, weaponIndex: 6, ap: 10, tokenId:1200},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:1278},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:1374},
{weaponTier: 3, weaponIndex: 6, ap: 10, tokenId:1375},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:1441},
{weaponTier: 3, weaponIndex: 6, ap: 10, tokenId:2108},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:2529},
{weaponTier: 3, weaponIndex: 6, ap: 10, tokenId:2800},
{weaponTier: 3, weaponIndex: 6, ap: 12, tokenId:2826},
{weaponTier: 3, weaponIndex: 6, ap: 12, tokenId:3140},
{weaponTier: 3, weaponIndex: 6, ap: 12, tokenId:3179},
{weaponTier: 3, weaponIndex: 7, ap: 12, tokenId:3345},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:3468},
{weaponTier: 3, weaponIndex: 7, ap: 12, tokenId:3481},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:3756},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:3830},
{weaponTier: 3, weaponIndex: 7, ap: 12, tokenId:3836},
{weaponTier: 3, weaponIndex: 6, ap: 10, tokenId:4140},
{weaponTier: 3, weaponIndex: 6, ap: 12, tokenId:4309},
{weaponTier: 3, weaponIndex: 7, ap: 12, tokenId:4394},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:4642},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:5038},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:5099},
{weaponTier: 3, weaponIndex: 7, ap: 12, tokenId:5151},
{weaponTier: 3, weaponIndex: 7, ap: 10, tokenId:5176},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:5279},
{weaponTier: 3, weaponIndex: 6, ap: 12, tokenId:5586},
{weaponTier: 3, weaponIndex: 6, ap: 10, tokenId:5590},
{weaponTier: 3, weaponIndex: 6, ap: 12, tokenId:5614},
{weaponTier: 3, weaponIndex: 6, ap: 10, tokenId:5628},
{weaponTier: 3, weaponIndex: 6, ap: 12, tokenId:5683},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:5808},
{weaponTier: 3, weaponIndex: 6, ap: 12, tokenId:5854},
{weaponTier: 3, weaponIndex: 6, ap: 10, tokenId:5874},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:6201},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:6215},
{weaponTier: 3, weaponIndex: 8, ap: 12, tokenId:6305},
{weaponTier: 3, weaponIndex: 8, ap: 10, tokenId:6324},
{weaponTier: 3, weaponIndex: 7, ap: 10, tokenId:6476},

]



async function main() {
    
 
    const iface = new ethers.utils.Interface([{
        "inputs": [
          {
            "internalType": "uint256[]",
            "name": "ids",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "campaign_",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "tryWeapon_",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "tryAccessories_",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "useitem_",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "rampage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }])

      const ElvesPoly = await ethers.getContractFactory("PolyEthernalElvesV4");
      const elves = ElvesPoly.attach("0x4deab743f79b582c9b1d46b4af61a69477185dd5")    

      /*
      for(let i = 33; i < fixWeapons.length; i++){
        let result = await elves.changeElfWeapons(fixWeapons[i].tokenId, fixWeapons[i].weaponIndex, fixWeapons[i].weaponTier, fixWeapons[i].ap, {gasLimit: 1000000})
        console.log("result: ",fixWeapons[i], result.hash)
        sleep(3000)
    }


   for(let i = 1; i < fixAxaTokens.length; i++){
        let result = await elves.changeElfAccessory(1,fixAxaTokens[i])
        console.log("result: ",fixAxaTokens[i], result.hash)
        sleep(3000)
    }
  

    for(let i = 1; i < fixRenlost.length; i++){
    
        let result = await elves.setAccountBalance(fixRenlost[i].wallet, fixRenlost[i].amount)
        console.log("result: ",fixRenlost[i].wallet, result.hash)
        sleep(3000)
     }


    




  */    

let changeCount = 0;
    
    for(let i = 0; i < txHashArray.length; i++){

    let response = await ethers.provider.getTransaction(txHashArray[i])
    let decode = iface.decodeFunctionData('rampage', response.data)

    let tokenIds = decode[0]
    let rampageId = parseInt(decode[1]) 


        tokenIds.forEach(async (tokenId) => {
          //  let data1 = await elves.attributes(tokenId)
          //  let data2 = await elves.eleves(tokenId)
            console.log("tokenId: ", parseInt(tokenId), "rampageId:", rampageId, "tx: ", txHashArray[i])
          // console.log("data1: ", data1)
          // console.log("data2: ", data2)
            changeCount++
        })       


    
      sleep(3000)

    }

      console.log("changeCount: ", changeCount)

    
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
