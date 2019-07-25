import React from "react";
import imageSource from "./smile.jpg";
import "./App.css";
import ScratchCard from "./scratchCard";
import { Modal, colors } from "@anarock/pebble";
import Scratch from "./scratchy";

class App extends React.PureComponent {
  cardClicked = ({ amount, state }) => {      
    this.setState({ modalVisible: true, scratchable: (state==="granted"), amount });
  };
  closeModal = _ => this.setState({ modalVisible: false });
  state = {
    modalVisible: false,
    cardData: null,
    scratchable: null,
    amount: null
  };
  componentWillMount() {
    //fetch call to get array of cards;

    fetch(
      "http://yasjain-box.aka.corp.amazon.com:7000/concession/get?customerId=A215LZ80O14S5H"
    )
      .then(cardData => cardData.text())
      .then(cardData => {
        const parsed = JSON.parse(cardData);
        console.log(parsed);
        this.setState({ cardData: parsed });
      })
      .catch(e => console.log(e));
  }
  preventMotion = e => {
    e.preventDefault();
  };
  render() {
    const { cardData, modalVisible } = this.state;
    return (
      <>
        <div className="App">
          <ScratchCard
            cardData={cardData}
            handleClick={this.cardClicked}
          />
        </div>
        <Modal visible={modalVisible}>
          <div
            style={{
              display: "flex",
              "flex-direction": "column",
              "justify-content": "space-between",
              height: "65vh"
            }}
          >
            <div
              style={{
                padding: "5%",
                color: colors.white.base,
                fontWeight: "bolder",
                fontSize: "15",
                paddingBottom: "0",
                cursor: "pointer",
                height: "100%",
                width: "100%"
              }}
              onClick={this.closeModal}
            >
              X
            </div>

            <div
              onClick={this.closeModal}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                height: "65%"
              }}
              onTouchMove={this.preventMotion}
            >
              <Scratch
                height="300px"
                width="37vh"
                scratchable={this.state.scratchable}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: colors.white.base,
                    height: "300px",
                    width: "37vh"
                  }}
                >
                  {`Congratulations, you've won ${this.state.amount}`}
                </div>
              </Scratch>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default App;
