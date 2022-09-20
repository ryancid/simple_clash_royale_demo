import { useState } from "react";
import axios from "axios";

const useCards = () => {
  const [cards, setCards] = useState([]);

  const fetchCards = () => {
    axios("/api/cards").then(
      (result) => {
        if (Array.isArray(result.data?.items)) {
          setCards(result.data.items);
        }
      },
      (reason) => console.error(reason)
    );
  };

  return { cards, fetchCards };
};

export default useCards;
