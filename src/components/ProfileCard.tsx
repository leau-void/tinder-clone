import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Location, User } from "../types";

const FullSizeCard = styled.div``;

const StyledCard = styled.div``;

const Panel = styled.main``;

const NameAgeWrap = styled.div``;

const Name = styled.div``;

const Age = styled.div``;

const City = styled.div``;

const Gender = styled.div``;

const Orientation = styled.div``;

const Description = styled.div``;

const PassionsWrap = styled.div``;

const Passion = styled.div``;

const Distance = styled.div``;

const ProfileCard = ({
  user,
  compareLocation,
}: {
  user: User;
  compareLocation?: Location;
}) => {
  const {
    name,
    age,
    city,
    gender,
    orientation,
    description,
    passions,
    photos,
  } = user.profile;

  const [isFullSize, setIsFullSize] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const distance = 0;

  const getDescription = useCallback(
    () => <Description>{description}</Description>,
    [description]
  );

  const getPassionsWrap = useCallback(
    () => (
      <PassionsWrap>
        {passions.map((passion) => (
          <Passion>{passion}</Passion>
        ))}
      </PassionsWrap>
    ),
    [passions]
  );

  const getCity = useCallback(() => <City>{city}</City>, [city]);

  const getDistance = useCallback(
    () => <Distance>{distance}</Distance>,
    [distance]
  );

  const getCorrectPart = (currentPhoto: number): JSX.Element | null => {
    switch (currentPhoto) {
      case 0:
        return description ? (
          getDescription()
        ) : passions[0] ? (
          getPassionsWrap()
        ) : city || distance ? (
          <>
            {getCity()}
            {getDistance()}
          </>
        ) : null;
      case 1:
        return passions[0] ? (
          getPassionsWrap()
        ) : city || distance ? (
          <>
            {getCity()}
            {getDistance()}
          </>
        ) : description ? (
          getDescription()
        ) : null;
      default:
        return city || distance ? (
          <>
            {getCity()}
            {getDistance()}
          </>
        ) : passions[0] ? (
          getPassionsWrap()
        ) : description ? (
          getDescription()
        ) : null;
    }
  };

  return isFullSize ? (
    <FullSizeCard></FullSizeCard>
  ) : (
    <StyledCard>
      <NameAgeWrap>
        <Name>{name}</Name>
        <Age>{age}</Age>
      </NameAgeWrap>
      {getCorrectPart(currentPhoto)}
      <button onClick={() => setCurrentPhoto(currentPhoto + 1)} />
    </StyledCard>
  );
};

export default ProfileCard;
