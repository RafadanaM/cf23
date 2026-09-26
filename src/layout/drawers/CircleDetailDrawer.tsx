import {
  RemixiconComponentType,
  RiCalendarCheckLine,
  RiFacebookCircleLine,
  RiFileImageLine,
  RiInstagramLine,
  RiLink,
  RiMapPinLine,
  RiTwitterXLine
} from '@remixicon/react';
import { PropsWithChildren } from 'react';

import { Badge } from '@/core/ui/components/badge';
import { Button } from '@/core/ui/components/button';
import Drawer from '@/core/ui/components/drawer/Drawer';
import { DrawerProps } from '@/core/ui/components/drawer/DrawerProvider';

import { Circle, SocialMediaDetail, SocialMediaKind } from '@/domain/circle/types';

import { attendingDaysToString } from '@/domain/circle/utils';
import BookmarkButton from '@/features/bookmark/components/BookmarkButton';
import { useAppDrawer } from './useAppDrawer';

interface CircleDetailDrawerProps extends DrawerProps {
  circle: Circle;
}

function CircleDetailDrawer({ circle, close }: CircleDetailDrawerProps) {
  return (
    <Drawer close={close}>
      <Drawer.Header className="flex gap-2">
        {circle.imageUrl ? (
          <img
            src={circle.imageUrl}
            alt="circle avatar"
            width={80}
            height={80}
            className="object-cover w-20 h-20 border border-muted-foreground overflow-hidden rounded-md"
          />
        ) : (
          <div className="h-20 w-20 rounded-md flex justify-center items-center bg-secondary border border-muted-foreground">
            <RiFileImageLine size={36} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-1 gap-1">
          <div className="flex flex-col flex-1 gap-0.5">
            <h3 className="font-semibold text-xl">{circle.name}</h3>
            <div className="flex gap-1 items-center">
              <RiMapPinLine size={20} className="text-primary" />
              <span className="font-medium">{circle.code}</span>
            </div>
          </div>
          <BookmarkButton circleId={circle.id} size={'icon-lg'} />
        </div>
      </Drawer.Header>

      <Drawer.Body className="flex flex-col gap-4">
        <ul
          role="list"
          aria-label="social media links"
          className="grid grid-cols-4 gap-1 items-center"
        >
          {circle.socialMedias.map((socialMedia) => (
            <SocialMediaCard key={socialMedia.kind} socialMedia={socialMedia} />
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          {circle.sampleWorks.length > 0 && (
            <DetailSection title="Sample Works">
              <SampleWorks sampleWorks={circle.sampleWorks} />
            </DetailSection>
          )}
          <DetailSection title="Schedule">
            <Badge className="text-sm h-8 px-3 py-4">
              <RiCalendarCheckLine className="size-5" />
              {attendingDaysToString(circle.attendingDays)}
            </Badge>
          </DetailSection>

          <DetailSection title="Fandom">
            <ul
              role="list"
              aria-label="fandom list"
              className="flex gap-1 overflow-x-auto scrollbar-thin"
            >
              {circle.fandoms.map((fandom) => (
                <li role="listitem" key={fandom}>
                  <Badge
                    variant="outline"
                    className="capitalize text-sm h-8 px-3 py-4 border-primary text-primary"
                  >
                    {fandom}
                  </Badge>
                </li>
              ))}
            </ul>
          </DetailSection>
          <DetailSection title="Work Types">
            <ul
              role="list"
              aria-label="work types list"
              className="flex gap-1 overflow-x-auto scrollbar-thin"
            >
              {circle.workTypes.length === 0 && <span>{'-'}</span>}
              {circle.workTypes.map((fandom) => (
                <li role="list-item" key={fandom}>
                  <Badge
                    variant="outline"
                    className="capitalize text-sm h-8 px-3 py-4 border-primary text-primary"
                  >
                    {fandom}
                  </Badge>
                </li>
              ))}
            </ul>
          </DetailSection>
        </div>
      </Drawer.Body>

      <Drawer.Footer className="flex flex-col">
        <Button variant="default" className="flex-1 py-2" onClick={close}>
          {'Close'}
        </Button>
      </Drawer.Footer>
    </Drawer>
  );
}

export default CircleDetailDrawer;

interface DetailSectionProps {
  title: string;
}

function DetailSection({ title, children }: PropsWithChildren<DetailSectionProps>) {
  return (
    <section className="flex flex-col gap-1">
      <h4 className="font-medium">{title}</h4>
      {children}
    </section>
  );
}

interface SampleWorksProps {
  sampleWorks: string[];
}

function SampleWorks({ sampleWorks }: SampleWorksProps) {
  const { openDrawer } = useAppDrawer();

  const handleClick = (key: string, idx: number) => {
    openDrawer('SAMPLE_WORKS', {
      hideOverlay: true,
      works: sampleWorks,
      startingItemKey: `${key}-${idx}`
    });
  };

  return (
    <ul
      role="list"
      aria-label="circle sample works"
      className="flex gap-2 overflow-x-auto no-scrollbar"
    >
      {sampleWorks.map((sampleWorkUrl, idx) => (
        <li
          key={sampleWorkUrl}
          role="listitem"
          className="overflow-hidden shrink-0 size-16 rounded-md border-primary border-2"
        >
          <button
            type="button"
            onClick={() => handleClick(sampleWorkUrl, idx)}
            className="cursor-pointer"
          >
            <img
              src={sampleWorkUrl}
              alt={`sample work ${idx + 1}`}
              loading="lazy"
              className="size-16 object-cover hover:brightness-75 active:brightness-75"
              width={64}
              height={64}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

interface SocialMediaCardProps {
  socialMedia: SocialMediaDetail;
}

function SocialMediaCard({ socialMedia }: SocialMediaCardProps) {
  const Icon = IconMap[socialMedia.kind];

  return (
    <li>
      <Button
        asChild
        variant="outline"
        size="icon-lg"
        className="flex-1 w-full border-muted-foreground"
      >
        <a href={socialMedia.url} target="_blank" rel="noopener noreferrer">
          <Icon className="size-5" />
        </a>
      </Button>
    </li>
  );
}

const IconMap: Record<SocialMediaKind, RemixiconComponentType> = {
  TWITTER: RiTwitterXLine,
  FACEBOOK: RiFacebookCircleLine,
  INSTAGRAM: RiInstagramLine,
  OTHER: RiLink
};
