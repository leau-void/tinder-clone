import React, { useState } from "react";
import styled from "styled-components";
import { Location, Photo, User } from "../types";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faMapMarkerAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const Icon = styled(FontAwesomeIcon)`
  width: 25px !important;
  display: block;
`;

const FullSizeCard = styled.div`
  color: #606060;
`;

const StyledCard = styled.div`
  border-radius: 8px;
  width: 300px;
  height: 450px;
  position: relative;
  border: 2px solid black;
  background: #606060;
  color: white;
`;

const PartialInfo = styled.div`
  position: absolute;
  bottom: 0;
  width: 95%;
  padding: 0.5rem;
`;

const StyledPhotoWrap = styled.div``;

const PhotoWrap = ({ photos }: { photos: Photo[] }) => {
  return <StyledPhotoWrap></StyledPhotoWrap>;
};

const Panel = styled.main`
  background: white;
`;

const Header = styled.header``;

const ExpandButton = styled.button`
  border: 0;
  position: absolute;
  background: 0;
  top: 0;
  right: 0;
`;

const ReduceButton = styled.button`
  width: 30px;
  height: 30px;
  background: royalblue;
  border: 0;
`;

const NameAgeWrap = styled.div`
  display: flex;
  align-items: end;
`;

const Name = styled.div`
  margin-right: 1rem;
  font-size: max(1.5em, 25px);
`;

const Age = styled.div`
  font-size: max(1.1em, 18px);
`;

const City = styled.div`
  display: flex;
  align-items: center;
`;

const Distance = styled.div`
  display: flex;
  align-items: center;
`;

const Gender = styled.div``;

const Orientation = styled.div``;

const Description = styled.div``;

const PassionsWrap = styled.div`
  width: 95%;
  display: flex;
  flex-wrap: wrap;
`;

const Passion = styled.div`
  padding: 0.25rem 0.5rem;
  border: 1px solid white;
  margin: 0.2rem;
  border-radius: 20px;
`;

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

  const getCorrectPart = (currentPhoto: number): JSX.Element | null => {
    switch (currentPhoto) {
      case 0:
        return description ? (
          <Description>{description}</Description>
        ) : passions[0] ? (
          <PassionsWrap>
            {passions.map((passion) => (
              <Passion>{passion}</Passion>
            ))}
          </PassionsWrap>
        ) : city || distance ? (
          <>
            <City>
              <Icon size="xs" color="white" icon={faHome} />
              Lives in {city}
            </City>
            <Distance>
              <Icon size="xs" color="white" icon={faMapMarkerAlt} />
              {distance} kilometers away
            </Distance>
          </>
        ) : null;
      case 1:
        return passions[0] ? (
          <PassionsWrap>
            {passions.map((passion) => (
              <Passion>{passion}</Passion>
            ))}
          </PassionsWrap>
        ) : city || distance ? (
          <>
            <City>
              <Icon size="xs" color="white" icon={faHome} />
              Lives in {city}
            </City>
            <Distance>
              <Icon size="xs" color="white" icon={faMapMarkerAlt} />
              {distance} kilometers away
            </Distance>
          </>
        ) : description ? (
          <Description>{description}</Description>
        ) : null;
      default:
        return city || distance ? (
          <>
            <City>
              <Icon size="xs" color="white" icon={faHome} />
              Lives in {city}
            </City>
            <Distance>
              <Icon size="xs" color="white" icon={faMapMarkerAlt} />
              {distance} kilometers away
            </Distance>
          </>
        ) : passions[0] ? (
          <PassionsWrap>
            {passions.map((passion) => (
              <Passion>{passion}</Passion>
            ))}
          </PassionsWrap>
        ) : description ? (
          <Description>{description}</Description>
        ) : null;
    }
  };

  return (
    <>
      {isFullSize ? (
        <FullSizeCard>
          <PhotoWrap photos={photos} />
          <Panel>
            <ReduceButton onClick={() => setIsFullSize(false)} />
            <Header>
              <Gender>{gender}</Gender>
              <Orientation>{orientation}</Orientation>
              <NameAgeWrap>
                <Name>{name}</Name>
                <Age>{age}</Age>
              </NameAgeWrap>
              <City>
                <Icon size="sm" color="#606060" icon={faHome} />
                Lives in {city}
              </City>
              <Distance>
                <Icon size="sm" color="#606060" icon={faMapMarkerAlt} />
                {distance} kilometers away
              </Distance>
              <PassionsWrap>
                {passions.map((passion) => (
                  <Passion>{passion}</Passion>
                ))}
              </PassionsWrap>
            </Header>
            <Description>{description}</Description>
          </Panel>
        </FullSizeCard>
      ) : (
        <StyledCard>
          <PhotoWrap photos={photos} />
          <PartialInfo>
            <ExpandButton onClick={() => setIsFullSize(true)}>
              <Icon size="1x" color="white" icon={faInfoCircle} />
            </ExpandButton>
            <NameAgeWrap>
              <Name>{name}</Name>
              <Age>{age}</Age>
            </NameAgeWrap>
            {getCorrectPart(currentPhoto)}
          </PartialInfo>
        </StyledCard>
      )}
      <button
        onClick={() =>
          setCurrentPhoto(
            currentPhoto + 1 < photos.length ? currentPhoto + 1 : 0
          )
        }>
        next
      </button>
    </>
  );
};

export default ProfileCard;
