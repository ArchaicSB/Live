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
        flex={2}
        style={{
          backgroundColor: "#000000",
          padding: 8,
          borderRadius: 8,
          border: "8px solid var(--secondary)",
          boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)",
        }}
      >
      <s.TextTitle
        style={{
        textAlign: "center",
        fontSize: 60,
        fontWeight: "bold",
        color: "#ffffff",
        }}
      >
        Home of the Archaic Shell Babies
        </s.TextTitle>
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
                            color: "var(--primary-text)",
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
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
      </s.Container>
      </s.Container>
        <s.Container
            flex={3}
            jc={"center"}
            ai={"center"}
            style={{
              background-image: "/config/images/bgpic2.png",
              backgroundColor: "none",
              padding: 16,
              borderRadius: 16,
              border: "16px solid var(--secondary)",
              boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)",
              margin: "2px",
              height: "800px",
              }}
          >
          <s.SpacerMedium />
          <s.TextTitle
              style={{
                textAlign: "left",
                fontSize: 50,
                fontWeight: "bold",
                color: "#000000",
              }}
            >
            Who Are We?
          </s.TextTitle>
          <s.SpacerMedium />
          <s.TextDescription
            style={{
              textAlign: "left",
              fontSize: 32,
              fontWeight: "bold",
              color: "#000000",
            }}
          >
            Archaic Shell Babies are 10,000 unique digital collectible's swimming on the Ethereum Blockchain. 
            ASB is a groundbreaking NFT project with a mission to revolutionize conservation efforts through 
            the power of Web3 technology. We are exceptionally passionate about sea turtles and the ocean and are 
            dedicated to inspiring others to live a life in harmony with mother nature.
          </s.TextDescription>
      </s.Container>
        <s.Container
            flex={3}
            jc={"center"}
            ai={"center"}
            style={{
              background-image: "/config/images/garbagepatch.png",
              backgroundColor: "none",
              padding: 16,
              borderRadius: 16,
              border: "16px solid var(--secondary)",
              boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)",
              margin: "2px",
              }}
          >
          <s.TextTitle
              style={{
                textAlign: "right",
                fontSize: 50,
                fontWeight: "bold",
                color: "#000000",
              }}
            >
            Change Is Needed
          </s.TextTitle>
        </s.Container>
    </s.Screen>
  );
}

export default App;
