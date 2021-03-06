import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { MagnifyingGlass } from '@styled-icons/entypo/MagnifyingGlass';
import { Cancel } from '@styled-icons/material/Cancel';
import { ArrowBack } from '@styled-icons/boxicons-regular/ArrowBack';
import { useHistory, Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
import ProductList from 'component/share/ProductList';
import LoadingIcon from 'component/share/LoadingIcon';
import { GET_SEARCH_PRODUCT, GET_SEARCH_LOG } from 'graphql/product';
import { addCommaToNumber } from 'component/share/util';
import { Cart, CartContainer } from 'component/share/ShareStyle';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const Wrapper = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

const arrowMove = keyframes`
  50%{
    transform:translateX(-10px);
  }
`;

const Icon = styled(ArrowBack)`
  width: 30px;
  height: 30px;
  color: ${(props) => props.theme.color.icon};

  &:active {
    text-shadow: 1px 1px 2px #ff0000;
    animation: ${arrowMove} 0.2s ease-in-out;
    padding: 2px;
  }
`;

const SearchBox = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const IconActiveAnimation = keyframes`
  50%{
    transform: scale(1.1);
    color: ${(props) => props.theme.color.orange};
  }
`;

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  color: ${(props) => props.theme.color.icon};

  &:active {
    animation: ${IconActiveAnimation} 0.2s ease-in-out;
    color: ${(props) => props.theme.color.orange};
    border-bottom: 2px solid ${(props) => props.theme.color.orange};
    padding: 1%;
  }
`;

const InputContainer = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  width: 100%;
  margin: 0;
  margin-top: 10px;
  padding: 5px;
  border: none;
  border-bottom: 1.5px solid ${(props) => props.theme.color.pink};

  &:focus {
    border-color: ${(props) => props.theme.color.orange};
  }
`;

const StyledCancel = styled(Cancel)`
  width: 25px;
  height: 25px;
  color: ${(props) => props.theme.color.icon};
  &:active {
    animation: ${IconActiveAnimation} 0.2s ease-in-out;
    color: ${(props) => props.theme.color.orange};
  }
`;

const ResultBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 5px 0;
`;

function ResultItem(props) {
  const ItemWrapper = styled.div`
    display: flex;
    width: 100%;
    border: solid 2px #a3d2ca;
    padding: 10px;
    min-height: 40px;
    &hover {
      background-color: yellow;
    }
    margin: 5px 0;
    font-size: ${(props) => props.theme.size.mmd};
    border-radius: 5px;
    box-shadow: 2px 2px 2px #9bdeac;
  `;

  const ItemNameDiv = styled.div`
    color: #f09ae9;
  `;

  const ItemPrice = styled.div`
    margin-left: auto;
    color: #440047;
  `;

  return (
    <ItemWrapper>
      <ItemNameDiv>{props.Item.name}</ItemNameDiv>
      <ItemPrice>{`${addCommaToNumber(props.Item.price)}`}원</ItemPrice>
    </ItemWrapper>
  );
}

function SearchPage() {
  const history = useHistory();
  const [hasKeyword, setHasKeyword] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const inputText = React.createRef();

  // ------------ 스타일드 컴포넌트 영역
  const handleArrowBackIconClick = () => {
    history.goBack();
  };

  const handleCancelIconClick = () => {
    inputText.current.value = '';
    setHasKeyword(false);
    setIsSearched(false);
  };

  const handleInputClick = () => {
    // 검색 기록 출력
  };

  const handleInputChange = () => {
    if (inputText.current.value === '') {
      setHasKeyword(false);
    } else {
      setHasKeyword(true);
      setIsSearched(false);
      getSearchProduct({ variables: { keyword: inputText.current.value, limit: 10 } });
    }
  };

  const handleSearchClick = () => {
    setHasKeyword(false);
    setIsSearched(true);
    getSearchProduct({ variables: { keyword: inputText.current.value, limit: 50 } });
  };

  // ---------------- lasy query 영역
  const [getSearchProduct, { loading: loadingSearch, data: searchResult }] = useLazyQuery(GET_SEARCH_PRODUCT);
  const [getSearchLog, { data: searchLog }] = useLazyQuery(GET_SEARCH_LOG);

  // ----------------렌더 영역
  return (
    <Wrapper>
      <SearchBox>
        <Icon src={ArrowBack} onClick={handleArrowBackIconClick} />
        <InputContainer>
          <Input
            ref={inputText}
            onClick={handleInputClick}
            onChange={handleInputChange}
            placeholder="🔍 B마트 상품을 검색해보세요!"
          />
        </InputContainer>
        <StyledMagnifyingGlass onClick={handleSearchClick} />
        {hasKeyword || isSearched ? <StyledCancel onClick={handleCancelIconClick} /> : ''}
      </SearchBox>

      {searchResult && hasKeyword ? (
        <ResultBox>
          {searchResult.GetSearchProducts.map((result, index) => (
            <ResultItem key={index} Item={result} />
          ))}
        </ResultBox>
      ) : (
        ''
      )}
      {isSearched ? (
        loadingSearch ? (
          <LoadingIcon />
        ) : searchResult ? (
          <ProductList productItems={searchResult.GetSearchProducts} />
        ) : (
          ''
        )
      ) : (
        ''
      )}
      <StyledLink to={'/cart'}>
        <CartContainer>
          <Cart />
        </CartContainer>
      </StyledLink>
    </Wrapper>
  );
}

export default SearchPage;
