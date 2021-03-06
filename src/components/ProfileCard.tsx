import React, {
  Dispatch,
  SyntheticEvent,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import styled from "styled-components";
import { Location, Photo, User } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faMapMarkerAlt,
  faHome,
  faSuitcase,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../context/UserContext";
import { getDistance } from "geolib";
import userPlaceholder from "../assets/placeholders/userPlaceholder.png";

const Icon = styled(FontAwesomeIcon)`
  min-width: 25px;
  display: block;
`;

const FullSizeCard = styled.div`
  color: #606060;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  background: #e6e7e8;
  z-index: 80;

  &.only-photo {
    background: transparent;
  }
`;

const ScrollableCard = styled.div`
  color: #606060;
  width: 100%;
  max-height: 100vh;
  overflow-y: scroll;
`;

const StyledCard = styled.div`
  border-radius: 8px;
  width: 300px;
  height: 450px;
  position: absolute;
  background: #e6e7e8;
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const PartialInfo = styled.div`
  width: 100%;
  padding: 0.5rem 2.5%;
  background: linear-gradient(0deg, black 40%, transparent);
  position: relative;
  border-radius: 0 0 8px 8px;
`;

const StyledPhotoWrap = styled.div`
  height: 450px;
  display: flex;
  width: 300px;
  overflow-x: hidden;
  position: absolute;
  background: center / contain no-repeat url(${userPlaceholder}), #e6e7e8;
  border-radius: 8px;

  .full-size & {
    position: relative;
    margin: 0 auto;
    width: calc(70vh / 1.34);
    height: 70vh;
  }
`;

const PhotoContainer = styled.div`
  height: 450px;
  display: flex;
  width: 300px;
  position: absolute;
  left: calc(-${(props: { index: number }) => props.index} * 100%);

  .full-size & {
    width: calc(70vh / 1.34);
    height: 70vh;
  }
`;

const IndexDiv = styled.div`
  width: 95%;
  left: 2.5%;
  height: 4px;
  display: flex;
  position: absolute;
  top: 4px;
`;

const PhotoIndex = styled.div`
  width: 100%;
  background: #f5f5f5;
  opacity: 0.4;
  margin: 0 3px;
  border-radius: 8px;

  &.active {
    opacity: 1;
  }
`;

const PhotoElem = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

interface PhotoWrapProps {
  photos: Photo[];
  clickDispatch: Dispatch<{ type: "next" | "prev" | "init" }>;
  currentPhoto: number;
  expandHandler?: () => void;
  blockClicks?: boolean;
}

const PhotoWrap = ({
  photos,
  clickDispatch,
  currentPhoto,
  expandHandler,
  blockClicks,
}: PhotoWrapProps) => {
  const clickHandler = (e: SyntheticEvent) => {
    if (blockClicks) return;
    const target = e.target as HTMLElement;
    const { offsetX, offsetY } = e.nativeEvent as PointerEvent;
    if (offsetY / target.offsetHeight > 2 / 3 && expandHandler)
      return expandHandler();
    if (offsetX / target.offsetWidth < 1 / 2)
      return clickDispatch({ type: "prev" });
    if (offsetX / target.offsetWidth >= 1 / 2)
      return clickDispatch({ type: "next" });
  };

  return (
    <StyledPhotoWrap onClick={clickHandler}>
      <PhotoContainer index={currentPhoto}>
        {photos.map((photo, i) => (
          <PhotoElem key={i} src={photo.src} />
        ))}
      </PhotoContainer>
      <IndexDiv>
        {photos.map((photo, i) => (
          <PhotoIndex key={i} className={i === currentPhoto ? "active" : ""} />
        ))}{" "}
      </IndexDiv>
    </StyledPhotoWrap>
  );
};

const Panel = styled.main`
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  padding-bottom: 6rem;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #606060;
  padding: 0.5rem;

  & > * {
    margin: 0.25rem 0;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  & > * {
    margin: 0.25rem 0;
  }
`;

const ExpandButton = styled.button`
  border: 0;
  position: absolute;
  background: 0;
  top: -5px;
  right: 0;
`;

const ReduceButton = styled.button`
  background: #f5f5f5;
  width: 2em;
  height: 2em;
  padding: 0;
  border: 0;
  border-radius: 50%;
  position: absolute;
  top: -20px;
  right: 15px;

  & > * {
    transform-origin: center center;
    transform: scale(1.1);
  }
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
  margin: 0.25rem 0;
`;

const Job = styled.div`
  display: flex;
  align-items: center;
`;

const Distance = styled.div`
  display: flex;
  align-items: center;
`;

const Gender = styled.div``;

const Orientation = styled.div``;

const Description = styled.div`
  white-space: pre-wrap;

  line-height: 1.1rem;
  position: relative;
  max-width: 85%;

  :not(.full-size &) {
    max-height: 4.4rem;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

const PassionsWrap = styled.div`
  width: 95%;
  display: flex;
  flex-wrap: wrap;
`;

const Passion = styled.div`
  padding: 0.25rem 0.5rem;
  border: 1px solid;
  border-color: inherit;
  margin: 0.2rem;
  border-radius: 20px;
`;

const initPhoto = (n: number) => ({ currentPhoto: 0, n });

const photoReducer = (
  { n, currentPhoto }: { n: number; currentPhoto: number },
  { type }: { type: "next" | "prev" | "init" }
) => {
  switch (type) {
    case "next":
      return {
        n,
        currentPhoto: currentPhoto + 1 < n ? currentPhoto + 1 : currentPhoto,
      };
    case "prev":
      return { n, currentPhoto: currentPhoto === 0 ? 0 : currentPhoto - 1 };
    case "init":
      return initPhoto(n);
  }
};

const ProfileCard = ({
  user,
  compareLocation,
  children,
  onlyPhotos,
  blockClicks,
}: {
  user: User;
  compareLocation?: Location;
  children?: JSX.Element | JSX.Element[];
  onlyPhotos?: boolean;
  blockClicks?: boolean;
}) => {
  const {
    name,
    age,
    city,
    job,
    gender,
    orientation,
    description,
    passions,
    photos,
  } = user.profile;

  const [isFullSize, setIsFullSize] = useState(false);
  const [{ currentPhoto }, clickDispatch] = useReducer(
    photoReducer,
    photos.length,
    initPhoto
  );

  const currentUser = useContext(UserContext);

  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!user || !currentUser) return;
    const raw = Math.ceil(
      getDistance(
        { latitude: user.location.lat, longitude: user.location.lon },
        {
          latitude: currentUser.location.lat,
          longitude: currentUser?.location.lon,
        }
      ) / 1000
    );
    setDistance(raw <= 0 ? 1 : raw);
  }, [currentUser, user]);

  const getCorrectPart = (currentPhoto: number): JSX.Element | null => {
    switch (currentPhoto) {
      case 0:
        return description ? (
          <Description>{description}</Description>
        ) : passions[0] ? (
          <PassionsWrap>
            {passions.map((passion, i) => (
              <Passion key={i}>{passion}</Passion>
            ))}
          </PassionsWrap>
        ) : city || distance || job ? (
          <>
            {city && (
              <City>
                <Icon size="xs" color="#f5f5f5" icon={faHome} />
                Lives in {city}
              </City>
            )}
            {distance && (
              <Distance>
                <Icon size="xs" color="#f5f5f5" icon={faMapMarkerAlt} />
                {distance} {distance === 1 ? "kilometer" : "kilometers"} away
              </Distance>
            )}
            {job && (
              <Job>
                <Icon size="xs" color="#f5f5f5" icon={faSuitcase} />
                {job}
              </Job>
            )}
          </>
        ) : null;
      case 1:
        return passions[0] ? (
          <PassionsWrap>
            {passions.map((passion, i) => (
              <Passion key={i}>{passion}</Passion>
            ))}
          </PassionsWrap>
        ) : city || distance || job ? (
          <>
            {city && (
              <City>
                <Icon size="xs" color="#f5f5f5" icon={faHome} />
                Lives in {city}
              </City>
            )}
            {distance && (
              <Distance>
                <Icon size="xs" color="#f5f5f5" icon={faMapMarkerAlt} />
                {distance} {distance === 1 ? "kilometer" : "kilometers"} away
              </Distance>
            )}
            {job && (
              <Job>
                <Icon size="xs" color="#f5f5f5" icon={faSuitcase} />
                {job}
              </Job>
            )}
          </>
        ) : description ? (
          <Description>{description}</Description>
        ) : null;
      default:
        return city || distance || job ? (
          <>
            {city && (
              <City>
                <Icon size="xs" color="#f5f5f5" icon={faHome} />
                Lives in {city}
              </City>
            )}
            {distance && (
              <Distance>
                <Icon size="xs" color="#f5f5f5" icon={faMapMarkerAlt} />
                {distance} {distance === 1 ? "kilometer" : "kilometers"} away
              </Distance>
            )}
            {job && (
              <Job>
                <Icon size="xs" color="#f5f5f5" icon={faSuitcase} />
                {job}
              </Job>
            )}
          </>
        ) : passions[0] ? (
          <PassionsWrap>
            {passions.map((passion, i) => (
              <Passion key={i}>{passion}</Passion>
            ))}
          </PassionsWrap>
        ) : description ? (
          <Description>{description}</Description>
        ) : null;
    }
  };

  if (onlyPhotos)
    return (
      <FullSizeCard className="full-size only-photo">
        <PhotoWrap
          currentPhoto={currentPhoto}
          clickDispatch={clickDispatch}
          photos={photos}
        />
        {children && Array.isArray(children)
          ? children.map((child) => child)
          : children}
      </FullSizeCard>
    );

  return (
    <>
      {isFullSize ? (
        <FullSizeCard className="full-size">
          <ScrollableCard>
            <PhotoWrap
              currentPhoto={currentPhoto}
              clickDispatch={clickDispatch}
              photos={photos}
            />
            <Panel>
              <ReduceButton onClick={() => setIsFullSize(false)}>
                <Icon size="2x" color="blue" icon={faArrowCircleDown} />
              </ReduceButton>
              <Header>
                <NameAgeWrap>
                  <Name>{name}</Name>
                  <Age>{age}</Age>
                </NameAgeWrap>
                {city && (
                  <City>
                    <Icon size="sm" color="#606060" icon={faHome} />
                    Lives in {city}
                  </City>
                )}
                {distance && (
                  <Distance>
                    <Icon size="sm" color="#606060" icon={faMapMarkerAlt} />
                    {distance} {distance === 1 ? "kilometer" : "kilometers"}{" "}
                    away
                  </Distance>
                )}
                {job && (
                  <Job>
                    <Icon size="sm" color="#606060" icon={faSuitcase} />
                    {job}
                  </Job>
                )}
                <Gender>{gender}</Gender>
                <Orientation>{orientation}</Orientation>
                <PassionsWrap>
                  {passions.map((passion, i) => (
                    <Passion key={i}>{passion}</Passion>
                  ))}
                </PassionsWrap>
              </Header>
              <Body>
                <Description>{description}</Description>
              </Body>
              {children && Array.isArray(children)
                ? children.map((child) => child)
                : children}
            </Panel>
          </ScrollableCard>
        </FullSizeCard>
      ) : (
        <StyledCard className="profile-card">
          <PhotoWrap
            currentPhoto={currentPhoto}
            clickDispatch={clickDispatch}
            photos={photos}
            expandHandler={() => setIsFullSize(true)}
            blockClicks={blockClicks}
          />
          <PartialInfo
            onClick={() => {
              if (!blockClicks) setIsFullSize(true);
            }}>
            <ExpandButton
              onClick={() => {
                if (!blockClicks) setIsFullSize(true);
              }}>
              <Icon size="1x" color="#f5f5f5" icon={faInfoCircle} />
            </ExpandButton>
            <NameAgeWrap>
              <Name>{name}</Name>
              <Age>{age}</Age>
            </NameAgeWrap>
            {getCorrectPart(currentPhoto)}
            {children && Array.isArray(children)
              ? children.map((child) => child)
              : children}
          </PartialInfo>
        </StyledCard>
      )}
    </>
  );
};

export default ProfileCard;
