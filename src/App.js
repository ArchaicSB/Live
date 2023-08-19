import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 15px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 15px;
  font-weight: bold;
  color: var(--primary-text);
  width: 125px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px #000000;
  -webkit-box-shadow: 1px 6px 0px -2px #000000;
  -moz-box-shadow: 1px 6px 0px -2px #000000;
  :active {
    box-shadow: #000000;
    -webkit-box-shadow: #000000;
    -moz-box-shadow: #000000;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 15px;
  border-radius: 100%;
  border: solid;
  background-color: var(--secondary);
  padding: 15px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 45px;
  height: 45px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: #000000;
    -webkit-box-shadow: #000000;
    -moz-box-shadow: #000000;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 300px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 1s;
  transition: height 1s;
`;

export const StyledImg = styled.img`
  box-shadow: 2px 7px 15px 3px rgba(0, 0, 0, 0.7);
  border: 2px solid var(--secondary);
  background-color: var(--secondary);
  border-radius: 100%;
  width: 100px;
  @media (min-width: 767px) {
    width: 300px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(-primary);
  text-decoration: underline overline;
`;

export const Title = styled.h1`
  font-size: 50px;
  text-align: center;
  color: #000000;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [totalSupply, setTotalSupply] = useState(0);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: true,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 3) {
      newMintAmount = 3;
    }
    setMintAmount(newMintAmount);
  };

const getData = async () => {
  if (blockchain.account !== "" && blockchain.smartContract !== null) {
    const totalSupply = await blockchain.smartContract.methods.totalSupply().call();
    setTotalSupply(parseInt(totalSupply, 10));
    dispatch(fetchData(blockchain.account));
  }
};
  
    useEffect(() => {
    getData();
  }, [blockchain.account]);

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    
  const config = await configResponse.json();
    SET_CONFIG(config);
  };
  
  useEffect(() => {
    getConfig();
  }, []);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        jc={"center"}
        style={{
          backgroundColor: "#444",
          padding: 8,
          borderRadius: 8,
          border: "none",
          boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)",
        }}
      >
      <Title
        style={{
        textAlign: "center",
        fontSize: 50,
        fontWeight: "bold",
        color: "#eee",
        }}
      >
        Home of the Archaic Shell Babies
        </Title>
      <s.TextDescription
        ai={"center"}
        jc={"center"}
        style={{
        textAlign: "center",
        fontWeight: "bold",
        color: "#eee", 
        fontSize: 23,
        }}>
            Live for a purpose and join the movement.
         </s.TextDescription>
      </s.Container>
      <s.Container
        flex={2}
        ai={"center"}
        style={{ padding: 12, backgroundColor: true }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : true}
      >
        <a href={CONFIG.MARKETPLACE_LINK2}>
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        </a>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 12 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={3}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "none",
              padding: 16,
              borderRadius: 16,
              border: "16px solid var(--secondary)",
              boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
              Mint Your NFT!
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >
              <StyledButton
                onClick={(e) => {
                  window.open("https://linktr.ee/archaicsb");
                }}
                style={{
                  margin: "6px",
                }}
              >
                Social Links ❤️
              </StyledButton>
              <StyledButton
                style={{
                  margin: "6px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "https://linktr.ee/archaicsb");
                }}
              >
                {CONFIG.MARKETPLACE}
              </StyledButton>
            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--secondary-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--secondary-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--secondary-text)",
                      }}
                    >
                      Please connect wallet to see the correct # of NFT's minted.
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT METAMASK
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={2} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
              style={{ transform: "scaleX(1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "100%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--secondary-text)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} ) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--secondary-text)",
            }}
          >
            We have set the gas limit for the contract to successfully mint your NFT.
            We recommend that you don't change the gas limit.
          </s.TextDescription>
      </s.Container>
      </s.Container>
          <s.SpacerXSmall />
          <s.Container
            flex={1}
            ai={"center"}
            jc={"center"}
            display={"flex"}
            style={{
              backgroundColor: "#FFE5B4",
              padding: 8,
              borderRadius: 8,
              border: "none",
              boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)",
              width: "device-width",
            }}
          >
          <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
            Our Mission
          </s.TextTitle>
          <s.TextDescription
            style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              color: "var(--primary-text)"
            }}
          >
            Archaic Shell Babies is a groundbreaking NFT project with a mission to revolutionize conservation and humanitarian efforts through the power of Web3.
          </s.TextDescription>
         <s.SpacerSmall />
        <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
            Who Are We?
          </s.TextTitle>
         <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              color: "var(--primary-text)"
            }}
          >
            Archaic Shell Babies are 10,000 Sea Turtle digital collectible's on the Ethereum Blockchain. We're passionate about getting the ocean cleaned and inspiring others to live a life in harmony with mother nature.
          </s.TextDescription>
        <s.SpacerSmall />
        <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
            Story Time: A Keystone Species
          </s.TextTitle>
         <s.SpacerSmall />
        <s.TextDescription
            style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
              color: "var(--primary-text)"
            }}
          >
         Once upon a time, thousands of years ago, 7 species of Sea Turtles thrived in a world full of other marine life. As they swam through the oceans full of seeweed forests and kelp beds, they had an abundant food supply. 
   <s.SpacerSmall />
          Feeding on extra sea sponges, jelly fish, algae and more, they could re-product easily due to their everlasting and eternal environment. (These archaic creatures are a keystone species which means that they help balance the scale for the ocean food chain.)
   <s.SpacerSmall />
         Then one day, along came the humans with their everlasting and eternal need to grow, consume, and evolve.
   <s.SpacerSmall />
       "But.. I don't understand..?" Asked Greenie, one of our Sea Turtles. "How does this change my life..?" As Greenie grew a little bit older, and the humans grew a little bit stronger.. Greenie started looking around and asking.
    <s.SpacerSmall />
      "Where did the rest of the kelp go? And who ate all of the fish? Just a couple years ago I saw hundreds of jelly fish and sea sponges and now all I'm seeing are these pieces of a to-go box.
   <s.SpacerSmall />
     "WHAT OUT GREENIE!!!!" Yells the Luth, one sea turtle weighing in at 500 Kilos!! "WHATEVER THAT IS, ITS COMING RIGHT FOR YOU!" ... 
      <s.SpacerSmall />
   CRASH!!!!
      <s.SpacerSmall />
    "Awe man. It cracked my shell." said Greenie. "I think it was a boat. I heard that those are everywhere now. I think we should find a new place to live... the food is gone and it's not really safe..."
       <s.SpacerSmall />
      "We have nowhere else to go... This is our home... Its everyones home..." 
          </s.TextDescription>
         <s.SpacerSmall />
         </s.Container>
      <s.SpacerXSmall />
      <s.Container flex={1} jc={"center"} ai={"center"}
            image={CONFIG.SHOW_BACKGROUND ? "/config/images/snail.png" : true}
            style={{
              backgroundColor: "#000",
              padding: 8,
              borderRadius: 8,
              border: "none",
              width: "device-width",
              boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)",
            }}
          >
            <s.TextTitle
              style={{
                fontSize: 33,
                textAlign: "center",
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
                  Ask yourself... Why are we really here?
              </s.TextTitle>
              <s.TextTitle
              style={{
                fontSize: 33,
                textAlign: "center",
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
                  Do we have more to offer in life? More to contribute?
              </s.TextTitle>
            <StyledLogo alt={"trash"} src={"/config/images/trash.png"} ai={"center"}
              style={{width: "75%"}}
            />
            <s.TextTitle
              style={{
                fontSize: 33,
                textAlign: "center",
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
                  Plastic pollution is everywhere...
              </s.TextTitle>
              <StyledLogo alt={"garbagepatch"} src={"/config/images/garbagepatch.png"} ai={"center"}
                  style={{
                  width: "75%"
                }}
                  />
              <s.SpacerXSmall />
              </s.Container>
    </s.Screen>
  );
}

export default App;
