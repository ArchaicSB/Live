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
    box-shadow: #0B4008;
    -webkit-box-shadow: #0B4008;
    -moz-box-shadow: #0B4008;
  }
`;
export const StyledRoundButton = styled.button`
  padding: 15px;
  border-radius: 100%;
  border: solid;
  background-color: var(--primary);
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
    box-shadow: #0B4008;
    -webkit-box-shadow: #0B4008;
    -moz-box-shadow: #0B4008;
  }
`;
export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  background-color: var(--accent);
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
export const GradientBackground = styled.div`
  width: 100%;
  height: 100vh; /* Adjust as needed */
  background: linear-gradient(to bottom, #ff9900, #ff3399); /* Replace with your desired gradient colors */
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
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

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));  
    }
  };

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

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
  <s.Screen>
      <s.Container
      style={{
        color:"linear-gradient(to left bottom, #A9F1DF, #FFBBBB)",
        border: "4px solid #000"
      }}
      >
        <TextTitle style={{
          color:"#fff",
          }}>
          Archaic Shell Babies
        </TextTitle>
      </s.Container>
      <s.Container
        flex={2}
        ai={"center"}
        style={{ padding: 12, backgroundColor: "var(--primary)",
        width:"device-width"}}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : true}
      >
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
              marginLeft: 36,
              borderRadius: 16,
              border: "16px solid var(--secondary)",
              boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)",
            }}
          >
            <s.TextTitle id="mint"
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
              Mint Your NFT
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
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
                  color: "var(--primary-text)",
                }}
              >
                Social Links ❤️
              </StyledButton>
              <StyledButton
                style={{
                  margin: "6px",
                  color: "var(--primary-text)",
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
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
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
                        color: "var(--accent-text)",
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
        <s.Container jc={"center"} ai={"center"} style={{ width: "75%" }}>
          <s.TextDescription
            style={{
              fontSize: "12px",
              textAlign: "center",
              color: "var(--secondary-text)",
            }}
          >
            Please make sure you are connected to the (
            {CONFIG.NETWORK.NAME} ) network and the correct address. Please note: Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              fontSize: "12px",
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
             display={"flex"}
             flex={1}
             width={"device-width"}
             ai={"center"}
             jc={"center"}
              style={{
              background: "linear-gradient(to bottom right, #FFE5B4, #7DF9FF, #FFE5B4)",
              padding: 8,
              height: "100%",
              borderRadius: 8, 
              border: "none", 
              boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)", 
            }}
            >
          <s.TextTitle id="mission"
              style={{
                textAlign: "center",
                fontSize: 33,
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
            Our Mission
          </s.TextTitle>
          <s.TextDescription
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              color: "var(--primary-text)",
            }}
            >
            Welcome to Archaic Shell Babies, where the magic of Web3 meets the beauty of nature. 
            Our mission is to protect and preserve the ancient sea turtles and our precious 
            oceans. We're combining technology and conservation to create a meaningful community. 
            As our NFT collection grows, so does our impact. We pledge to donate to Sea 
            Turtle conservation projects and Ocean plastic cleanup initiatives, ensuring a brighter 
            future for our planet.
          </s.TextDescription>
         <s.SpacerMedium />
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 33,
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
              Who Are We?
            </s.TextTitle>
          <s.SpacerMedium />
          <s.TextDescription
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              color: "var(--primary-text)",
            }}
          >
            A collection of 10,000 unique NFTs swimming on the Ethereum blockchain. 
            We're passionate about getting the ocean cleaned and inspiring others to live a 
            life in harmony with mother nature. Web3 and the internet have created amazing 
            communities that have the ability to come together and make a difference. We 
            are harnessing that ability to make an impact for the ocean and its life.
          </s.TextDescription>
        <s.SpacerSmall />
        </s.Container>
        <s.SpacerSmall />
        <s.Container id="utility"
             display={"flex"}
             flex={1}
             ai={"center"}
             jc={"center"}
             width={"device-width"}
              style={{
              background: "linear-gradient(to top right, #FFE5B4, #7DF9FF, #FFE5B4)",
              padding: 24,
              height: "100%",
              borderRadius: 8, 
              border: "none",
              boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)", 
            }}
            >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 33,
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
              Utility
            </s.TextTitle>
            <s.SpacerSmall />
              <s.TextDescription
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "var(--primary-text)",
                }}
              >
              Owning an ArchaicSB NFT is your key into future opportunities 
              and benefits through the Sea Turtle Club. As an NFT holder, you'll gain special access to upcoming projects, 
              ventures, and in-person events. It's not just about collecting our NFTs... but joining a 
              movement to be a part of something special. Let's shape the future together. 
              </s.TextDescription>
              <s.SpacerMedium />
              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 33,
                  fontWeight: "bold",
                  color: "var(--primary-text)",
                }}
              >
                Discount Book:
              </s.TextTitle>
              <s.SpacerMedium />
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "var(--primary-text)",
                  }}
                >
                   We've partnered with a Sea Turtle organization that offer unforgettable travel experiences. 
                  As an NFT holder, you'll enjoy special discounts on these unforgettable journeys and experiences. 
                  The discount book is your access to a range of eco-friendly and sustainable products.
                  Savings on stylish tote bags, reusable water bottles, metal straws, clothing, and 
                  unique sea turtle merchandise can be discovered here. As our partnerships grow, so will 
                  the discount book.
          </s.TextDescription>
         </s.Container>
          <s.SpacerSmall />
          <s.Container id="club"
             ai={"center"} 
             jc={"center"} 
             display={"flex"}
             style={{ 
                background: "linear-gradient(to bottom right, #000, #fff)",
                padding: 12,
                borderRadius: 8, 
                border: "none", 
                boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)", 
             }}
           >
          <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 33,
                  fontWeight: "bold",
                  color: "var(--primary-text)",
                }}
              >
                Archaic Sea Turtle Club:
              </s.TextTitle>
              <s.SpacerSmall />
              <s.TextDescription
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "var(--primary-text)",
                  }}
                >
            This section is coming soon!
          </s.TextDescription>
          <s.SpacerMedium />
        </s.Container>
        <s.SpacerSmall />
        <s.Container id="shop"
             ai={"center"} 
             jc={"center"} 
             display={"flex"}
             style={{ 
                background: "linear-gradient(to bottom right, #000, #fff)",
                padding: 12,
                borderRadius: 8, 
                border: "none", 
                boxShadow: "0px 3px 9px 2px rgba(0,0,0,0.9)", 
             }}
           >
          <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 33,
                  fontWeight: "bold",
                  color: "var(--primary-text)",
                }}
              >
                Visit Our Store!
              </s.TextTitle>
              <s.SpacerSmall />
              <s.TextDescription
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "var(--primary-text)",
                  }}
                >
            This section is coming soon!
          </s.TextDescription>
          <s.SpacerMedium />
        </s.Container>
          <s.SpacerXSmall />
  </s.Screen>
  );
}

export default App;
