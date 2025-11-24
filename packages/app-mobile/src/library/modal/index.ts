import Body, { type ModalBodyProps } from './body';
import Footer, { type ModalFooterProps } from './footer';
import Header, { type ModalHeaderProps } from './header';
import Modal, { type ModalProps } from './modal';

export default {
  Root: Modal,
  Header,
  Body,
  Footer,
};

export type { ModalBodyProps, ModalFooterProps, ModalHeaderProps, ModalProps };
