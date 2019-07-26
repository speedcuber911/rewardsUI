import React from "react";
import "./App.css";
import { colors } from "@anarock/pebble";
import imageSource from "./reward.png";
import unScratchedCard from "./laurels.png";

export default class ScratchCard extends React.PureComponent {
  render() {
    const { cardData } = this.props;
    if (!cardData) return null;
    const cards = cardData
      .map(r => {
        if (!r.grantedTime) r.grantedTime = Date.now();
        return r;
      })
      .sort((f, s) => s.grantedTime - f.grantedTime)
    const newCards = [
      ...cards.filter(cardData => !(cardData.state === "granted")),
      ...cards.filter(cardData => (cardData.state === "granted"))
    ];       
    const cardRow = newCards.reduce((acc, el, i) => {
      (i + 1) % 2 ? acc.push([el]) : acc[(i - 1) / 2].push(el);
      return acc;
    }, []);
    return (
      <>
        {cardRow.map(cardRow => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            {cardRow.map((cardData, i) => {
              // console.log(cardData.grantedTime);
              const { amount, state } = cardData;
              const granted = state === "granted";
              return (
                <div
                  className="Scratch-Card"
                  onClick={() => this.props.handleClick(cardData)}
                  style={{
                    background: granted ? colors.white.base : colors.teal.light,
                    color: colors.gray.darker
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingBottom: "10px"
                    }}
                  >
                    <div>
                      <img
                        src={granted ? imageSource : unScratchedCard}
                        width={granted ? 100 : 120}
                        height={granted ? 100 : 120}
                      />
                    </div>
                    <div>{granted ? `₹${amount}` : `Feeling Lucky!`}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </>
    );
  }
}
