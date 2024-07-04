import React, { useState, useEffect, useMemo } from 'react';
import { AppBar, Toolbar, Typography, Container, TextField, Card, CardContent, Grid, IconButton, styled, Tooltip, Link, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4), // 하단 여백 추가
  fontFamily: 'Noto Sans KR, sans-serif',
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#e3f2fd', // 연한 파란색
  marginBottom: theme.spacing(2), // 아코디언 박스와 서치박스 사이 간격 추가
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  display: 'block', // 내용 전체를 블록으로 설정하여 줄 바꿈 시 정렬 문제 해결
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2), // 서치박스와 아코디언 박스 사이 간격 추가
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  backgroundColor: theme.palette.grey[100], // 카드 배경색 변경
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const BoldTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold', // 볼드체로 변경
  fontSize: '1.5rem' // 폰트 사이즈 조정
}));

const AddressText = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.primary.main,
  textDecoration: 'none' // 언더바 제거
}));

const ShortRegionText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem' // 작은 폰트 사이즈
}));

const ListTypography = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  textIndent: '-1em',
  paddingLeft: '1em',
}));

interface Company {
  name: string;
  contact: string;
  region: string;
  industry: string;
  grade: string; // grade 추가
}

const App: React.FC = () => {
  const [data, setData] = useState<Company[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = window.location.hostname === 'localhost'
        ? ''
        : 'https://gard2np.github.io/info'; // GitHub Pages 배포 URL 포함
      try {
        const response = await axios.get(`${baseUrl}/data/companies.json`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredData = useMemo(
    () => data.filter(company =>
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.region.toLowerCase().includes(search.toLowerCase())
    ),
    [search, data]
  );

  const handleClickOpen = (region: string) => {
    setDialogContent(region);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderRegion = (region: string) => {
    const shortRegion = region.length > 7 ? `${region.substring(0, 7)}...` : region;
    return (
      <AddressText onClick={() => handleClickOpen(region)}>
        {shortRegion}
        {region.length > 7 && <ShortRegionText>(전체주소 보기)</ShortRegionText>}
      </AddressText>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
            도시가스 시공업체 List
          </Typography>
        </Toolbar>
      </AppBar>
      <StyledContainer>
        <StyledAccordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>공지사항 및 사용법</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            <ListTypography>
              1. 가스시설시공업체 List는 참고 자료로서 당사와 무관함을 알려드립니다.
            </ListTypography>
            <ListTypography>
              2. 시공업체의 면허 말소 확인은 관할 지자체에 문의하시기 바랍니다.
            </ListTypography>
            <ListTypography>
              3. 노출 순서는 주소 기준 "가나다..." 순입니다.
            </ListTypography>
            <ListTypography>
              4. 전화번호 클릭 시 전화 연결로 이동합니다.
            </ListTypography>
            <ListTypography>
              5. 주소 클릭 시 전체 주소가 나타납니다.
            </ListTypography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledTextField
          label="회사명 또는 행정구역을 검색하세요"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            )
          }}
        />
        <Grid container spacing={2}>
          {filteredData.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.name}>
              <StyledCard>
                <CardContent>
                  <StyledTypography variant="body2" color="textSecondary">{company.grade}</StyledTypography> {/* grade 추가 */}
                  <BoldTypography variant="h6">{company.name}</BoldTypography>
                  <StyledTypography variant="body1">
                    <Link href={`tel:${company.contact}`} style={{ textDecoration: 'none' }}>{company.contact}</Link>
                  </StyledTypography>
                  <StyledTypography variant="body2" style={{ marginTop: '8px' }}>{renderRegion(company.region)}</StyledTypography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>전체 주소</DialogTitle>
          <DialogContent>
            <Typography>{dialogContent}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </StyledContainer>
    </>
  );
}

export default App;
