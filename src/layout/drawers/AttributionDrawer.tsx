import { Button } from '@/core/ui/components/button';
import Drawer from '@/core/ui/components/drawer/Drawer';
import { DrawerProps } from '@/core/ui/components/drawer/DrawerProvider';

function AttributionDrawer({ close }: DrawerProps) {
  return (
    <Drawer close={close}>
      <Drawer.Header className="flex gap-2 pb-2">
        <h2 className="text-xl font-semibold capitalize">{'Attribution'}</h2>
      </Drawer.Header>

      <Drawer.Body className="flex flex-col gap-2 border-t border-border">
        <section>
          <h3 className="text-lg font-medium">{'Disclaimer:'}</h3>
          <p className="">
            {
              'This site is an independent project and not officially affiliated with or endorsed by Comifuro organisers.'
            }
          </p>
        </section>

        <section>
          <h3 className="text-lg font-medium">{'Acknowledgement:'}</h3>
          <p className="">
            This site was created using resources from the official
            <span className="font-semibold"> Comifuro Web Catalogue</span> website
            provided generously by <span className="font-semibold">Comifuro</span>{' '}
            organisers, which includes: circle information, circle images, and comifuro
            map.
          </p>
          <p className="mt-1">
            I am grateful to all the organisers for making the information publicly
            available.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-medium">
            {'Detail About Comifuro can be seen here:'}
          </h3>

          <ul>
            <li>
              <a
                href="https://comifuro.net"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                {'Comifuro Official Website'}
              </a>
            </li>

            <li>
              <a
                href="https://catalog.comifuro.net/catalog"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                {'Comifuro Web Catalogue'}
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-medium">
            {'Detail About This site can be seen here:'}
          </h3>

          <ul>
            <li>
              <a
                href="https://github.com/RafadanaM/cf23"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                {'CF 23 Interactive Map Website'}
              </a>
            </li>

            <li>
              <a
                href="https://github.com/RafadanaM/cf23-api"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                {'CF 23 Interactive Map API'}
              </a>
            </li>
          </ul>
        </section>
      </Drawer.Body>
      <Drawer.Footer className="flex flex-col">
        <Button size="lg" onClick={close}>
          {'Close'}
        </Button>
      </Drawer.Footer>
    </Drawer>
  );
}

export default AttributionDrawer;
