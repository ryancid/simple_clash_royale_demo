import { Button, TextField } from "@mui/joy";
import { useCallback, useState } from "react";

const Player = (id) => {
  const fetchPlayer = useCallback(() => {
    axios("/api/player/" + id).then(
      (result) => {
        //TODO: set player info
        console.log(result);
      },
      (reason) => console.error(reason)
    );
  }, [id]);
  useEffect(() => {
    return () => {};
  }, [id]);
};

const Players = () => {
  const [playerId, setplayerId] = useState("");
  return (
    <div>
      players in progress
      <TextField
        placeholder="type game tag like #R09228V"
        endDecorator={<Button>Search</Button>}
      />
    </div>
  );
};

export default Players;
