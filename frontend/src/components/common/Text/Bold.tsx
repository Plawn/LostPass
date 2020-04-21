import React, { ReactNode } from 'react';

const Bold: React.FC<{}> = ({ children }: { children?: ReactNode }) => <span style={{ fontWeight: 'bold' }}>{children}</span>;

export default Bold;