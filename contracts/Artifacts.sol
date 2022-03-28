pragma solidity ^0.8.7;

import "erc721a/contracts/ERC721A.sol";

contract ElvesArtifacts is ERC721A {

  constructor() ERC721A("EthernalElves Artifacts", "ELVA") {}

  function mint(uint256 quantity) external payable {
    // _safeMint's second argument now takes in a quantity, not a tokenId.
    _safeMint(msg.sender, quantity);
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = "https://ethernalelves.com/artifact/";
        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI)) : "";
  }

/*

░█████╗░██████╗░████████╗░░██╗██╗███████╗░█████╗░░█████╗░████████╗░██████╗██╗░░
██╔══██╗██╔══██╗╚══██╔══╝░██╔╝██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝╚██╗░
███████║██████╔╝░░░██║░░░██╔╝░██║█████╗░░███████║██║░░╚═╝░░░██║░░░╚█████╗░░╚██╗
██╔══██║██╔══██╗░░░██║░░░╚██╗░██║██╔══╝░░██╔══██║██║░░██╗░░░██║░░░░╚═══██╗░██╔╝
██║░░██║██║░░██║░░░██║░░░░╚██╗██║██║░░░░░██║░░██║╚█████╔╝░░░██║░░░██████╔╝██╔╝░
╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░░░╚═╝╚═╝╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░░░╚═╝░░░╚═════╝░╚═╝░░
*/

string public constant header =
        '<svg id="elf" width="100%" height="100%" version="1.1" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';

string public constant footer =
        "<style>#elf{shape-rendering: crispedges; image-rendering: -webkit-crisp-edges; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; image-rendering: pixelated; -ms-interpolation-mode: nearest-neighbor;}</style></svg>";


    function getTokenURI(uint16 id_)
        external
        view
        returns (string memory)
    {
       
        string memory svg = Base64.encode(
            bytes("hi"
                //getSVG()
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"Elf #',
                                toString(id_),
                                '", "description":"EthernalElves Artifacts is a collection of artifacts required to awaken the Elders. These art pieces are 100% on-chain.", "image": "',
                                "data:image/svg+xml;base64,",
                                svg,
                                '",',
                                //getAttributes(),
                                "}"
                            )
                        )
                    )
                )
            );
    }

    ///
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

}


/// @title Base64
/// @author Brecht Devos - <brecht@loopring.org>
/// @notice Provides a function for encoding some bytes in base64
/// @notice NOT BUILT BY ETHERNAL ELVES TEAM.
library Base64 {
    string internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        // load the table into memory
        string memory table = TABLE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 3 bytes at a time
            for {

            } lt(dataPtr, endPtr) {

            } {
                dataPtr := add(dataPtr, 3)

                // read 3 bytes
                let input := mload(dataPtr)

                // write 4 characters
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(input, 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
            }

            // padding with '='
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }

        return result;
    }
}
   