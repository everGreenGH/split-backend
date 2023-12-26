// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import ERC721, Ownable, SafeMath
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// error handling

// contract 시작
contract HyojaeNFT is ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // 명함 발행 비용
    uint256 public constant mintFee = 0.1 ether;

    // define Business Card data
    struct BusinessCard {
        string name;
        uint8 age;
        string email;
        string website;
        string gender;
    }

    // tokenId를 키로 하는 명함 데이터
    mapping(uint256 => BusinessCard) private _BCInfoByTokenId;
    // address를 키로 하는 명함 데이터
    mapping(address => BusinessCard) private _BCInfoByAddress;
    // 주소를 키로 하는 발행된 본인 명함 개수
    mapping(address => uint256) private _amountCards;
    // TokenIds를 리턴하는 매핑
    mapping(address => uint256[]) private _exchangedTokenIdsOfOwner;

    // 새로운 정보를 등록하고 그 로그를 기록
    event registerInfo(
        address indexed issuer,
        string name,
        uint8 age,
        string email,
        string website,
        string gender
    );
    // card를 새로 mint했을 때 발생하는 event
    event mintCard(uint256 indexed tokenId, address issuer);

    // card를 교환했을 때 발생하는 event
    event cardExchanged(
        uint senderTokenId,
        uint recipientTokenId,
        address indexed issuer,
        address recipient
    );

    constructor() ERC721("HyojaeNFT", "hyojae") {}

    // 명함을 등록하는 함수
    function registerCard(
        string memory _name,
        uint8 _age,
        string memory _email,
        string memory _website,
        string memory _gender
    ) public payable {
        bool isIssuerMinted = _amountCards[msg.sender] > 0;

        // 발행된 명함이 없다면 무료, 아니면 비용 체크
        if (isIssuerMinted) {
            require(msg.value == mintFee, "Pay the issuance fee");
        } else {
            require(msg.value == 0, "New member do not need to pay");
        }

        // 명함 정보 등록
        _BCInfoByAddress[msg.sender] = BusinessCard(
            _name,
            _age,
            _email,
            _website,
            _gender
        );
        emit registerInfo(msg.sender, _name, _age, _email, _website, _gender);

        // 정보를 기반으로, 10개의 새로운 명함을 발급
        for (uint8 i = 0; i < 10; i++) {
            _tokenIdCounter.increment();
            uint256 newTokenId = _tokenIdCounter.current();
            _mint(msg.sender, newTokenId);
            _BCInfoByTokenId[newTokenId] = _BCInfoByAddress[msg.sender];
            emit mintCard(newTokenId, msg.sender);
        }

        // 명함 개수 갱신
        _amountCards[msg.sender] += 10;
    }

    // 명함을 교환하는 함수
    function exchangeCard(address _to) public {
        // 컨트랙트 발생시킨 사람한테 카드가 있는지 체크
        require(
            _amountCards[msg.sender] > 0,
            "You don't have a card to exchange"
        );
        // 교환할 상대에게 카드가 있는지 체크
        require(
            _amountCards[_to] > 0,
            "recipient don't have a card to exchange"
        );

        uint256 senderTokenId = tokenOfOwnerByIndex(msg.sender, 0);
        uint256 recipientTokenId = tokenOfOwnerByIndex(_to, 0);

        // 교환!!
        _transfer(msg.sender, _to, senderTokenId);
        _transfer(_to, msg.sender, recipientTokenId);

        _exchangedTokenIdsOfOwner[msg.sender].push(recipientTokenId);
        _exchangedTokenIdsOfOwner[_to].push(senderTokenId);

        emit cardExchanged(senderTokenId, recipientTokenId, msg.sender, _to);
    }

    // getter 함수
    function getCardInfos(
        uint256 tokenId
    ) public view returns (BusinessCard memory) {
        return _BCInfoByTokenId[tokenId];
    }

    function getTokenIds(
        address issuer
    ) public view returns (uint256[] memory) {
        require(
            _exchangedTokenIdsOfOwner[issuer].length > 0,
            "!!Haven't exchanged any Token!!"
        );
        return _exchangedTokenIdsOfOwner[issuer];
    }
}