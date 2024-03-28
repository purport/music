use flate2::read::GzDecoder;
use quick_xml::{events::Event, Reader};
use std::str;
use std::{fs::File, io::BufReader};

#[derive(Debug, Default)]
struct Master {
    id: u64,
    release: u64,
    year: u64,
    title: String,
    style: Vec<String>,
    genre: Vec<String>,
}

#[derive(Debug, Default)]
struct Artist {
    id: u64,
    name: String,
}

#[derive(Debug, Default)]
struct Release {
    id: u64,
}

fn main() {
    // let file = File::open("/home/purport/Code/music/data/discogs_20230501_masters.xml.gz")
    //     .expect("Unable to open file");
    // let file = File::open("/home/purport/Code/music/data/discogs_20230501_artists.xml.gz")
    //     .expect("Unable to open file");
    let file = File::open("/home/purport/Code/music/data/discogs_20230501_releases.xml.gz")
        .expect("Unable to open file");
    let file = GzDecoder::new(file);
    let file = BufReader::new(file);
    let mut reader = Reader::from_reader(file);
    reader.trim_text(true);

    let mut buf = Vec::new();
    let mut buf2 = Vec::new();
    let mut master_count = 0;
    let mut artist_count = 0;
    let mut release_count = 0;
    loop {
        match reader.read_event_into(&mut buf).unwrap() {
            Event::Eof => break,
            Event::Start(e) if e.name().as_ref() == b"releases" => loop {
                match reader.read_event_into(&mut buf2).unwrap() {
                    Event::Start(e) if e.name().as_ref() == b"release" => {
                        release_count += 1;
                        let release = parse_release(&mut reader, e);
                        // println!("{:?}", release);
                    }
                    Event::End(e) if e.name().as_ref() == b"releases" => break,
                    e => todo!("{:?}", e),
                }
            },
            Event::Start(e) if e.name().as_ref() == b"artists" => loop {
                match reader.read_event_into(&mut buf2).unwrap() {
                    Event::Start(e) if e.name().as_ref() == b"artist" => {
                        artist_count += 1;
                        let artist = parse_artist(&mut reader, e);
                        println!("{:?}", artist);
                    }
                    Event::End(e) if e.name().as_ref() == b"artists" => break,
                    e => todo!("{:?}", e),
                }
            },
            Event::Start(e) if e.name().as_ref() == b"masters" => loop {
                match reader.read_event_into(&mut buf2).unwrap() {
                    Event::Start(e) if e.name().as_ref() == b"master" => {
                        master_count += 1;
                        let master = parse_master(&mut reader, e);
                        println!("{:?}", master);
                    }
                    Event::End(e) if e.name().as_ref() == b"masters" => break,
                    e => todo!("{:?}", e),
                }
            },
            Event::Start(e) => todo!("{:?}", e),
            Event::End(_) => todo!(),
            Event::Empty(_) => todo!(),
            Event::Text(_) => todo!(),
            Event::CData(_) => todo!(),
            Event::Comment(_) => todo!(),
            Event::Decl(_) => todo!(),
            Event::PI(_) => todo!(),
            Event::DocType(_) => todo!(),
        }
    }
    println!("{master_count} masters");
}

fn parse_release(
    reader: &mut Reader<BufReader<GzDecoder<File>>>,
    e: quick_xml::events::BytesStart,
) -> Release {
    let mut buf3 = Vec::new();
    let mut buf4 = Vec::new();
    let mut name = String::new();
    let id = e
        .try_get_attribute("id")
        .expect("master should have an id")
        .expect("master should have an id")
        .value
        .iter()
        .fold(0u64, |acc, d| {
            10 * acc + Into::<u64>::into((*d).saturating_sub(0x30))
        });
    loop {
        match reader.read_event_into(&mut buf3).unwrap() {
            Event::Start(e) if e.name().as_ref() == b"images" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"artists" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"title" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Empty(e) if e.name().as_ref() == b"labels" => {}
            Event::Start(e) if e.name().as_ref() == b"labels" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Empty(e) if e.name().as_ref() == b"extraartists" => {}
            Event::Start(e) if e.name().as_ref() == b"extraartists" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"formats" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"genres" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"styles" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"country" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"released" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"notes" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"data_quality" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"master_id" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Empty(e) if e.name().as_ref() == b"tracklist" => {}
            Event::Start(e) if e.name().as_ref() == b"tracklist" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Empty(e) if e.name().as_ref() == b"identifiers" => {}
            Event::Start(e) if e.name().as_ref() == b"identifiers" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"videos" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Empty(e) if e.name().as_ref() == b"companies" => {}
            Event::Start(e) if e.name().as_ref() == b"companies" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::End(e) if e.name().as_ref() == b"release" => {
                return Release { id };
            }
            Event::Start(e) => todo!("{:?}", e),
            e => todo!("{:?}", e),
        }
    }
}

fn parse_artist(
    reader: &mut Reader<BufReader<GzDecoder<File>>>,
    e: quick_xml::events::BytesStart,
) -> Artist {
    let mut buf3 = Vec::new();
    let mut buf4 = Vec::new();
    let mut buf5 = Vec::new();
    let mut id = 0u64;
    let mut name = String::new();
    loop {
        match reader.read_event_into(&mut buf3).unwrap() {
            Event::Start(e) if e.name().as_ref() == b"id" => {
                match reader
                    .read_event_into(&mut buf5)
                    .expect("no main release text")
                {
                    Event::Text(t) => {
                        id = t.into_inner().iter().fold(0u64, |acc, d| {
                            10 * acc + Into::<u64>::into((*d).saturating_sub(0x30))
                        });
                    }
                    e => todo!("{:?}", e),
                }
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"images" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"name" => {
                match reader.read_event_into(&mut buf5).expect("no name text") {
                    Event::Text(t) => {
                        let unescape = &t.unescape().unwrap();
                        name = str::from_utf8(unescape.as_bytes()).unwrap().to_owned();
                        reader
                            .read_to_end_into(e.to_end().name(), &mut buf4)
                            .expect("unclosed tag");
                    }
                    Event::End(e) if e.name().as_ref() == b"name" => (),
                    e => todo!("{:?}", e),
                }
            }
            Event::Start(e) if e.name().as_ref() == b"realname" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"profile" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"data_quality" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"urls" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"namevariations" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Empty(e) if e.name().as_ref() == b"aliases" => {}
            Event::Start(e) if e.name().as_ref() == b"aliases" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"members" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"groups" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }

            Event::Start(e) => todo!("{:?}", e),
            Event::End(e) if e.name().as_ref() == b"artist" => return Artist { id, name },
            e => todo!("{:?}", e),
        }
    }
}

fn parse_master(
    reader: &mut Reader<BufReader<GzDecoder<File>>>,
    e: quick_xml::events::BytesStart,
) -> Master {
    let mut release: u64 = 0;
    let mut genre: Vec<String> = Vec::new();
    let mut style: Vec<String> = Vec::new();
    let mut title: String = String::new();
    let mut year: u64 = 0;
    let id = e
        .try_get_attribute("id")
        .expect("master should have an id")
        .expect("master should have an id")
        .value
        .iter()
        .fold(0u64, |acc, d| {
            10 * acc + Into::<u64>::into((*d).saturating_sub(0x30))
        });

    let mut buf3 = Vec::new();
    let mut buf4 = Vec::new();
    let mut buf5 = Vec::new();
    loop {
        match reader.read_event_into(&mut buf3).unwrap() {
            Event::Start(e) if e.name().as_ref() == b"main_release" => {
                match reader
                    .read_event_into(&mut buf5)
                    .expect("no main release text")
                {
                    Event::Text(t) => {
                        release = t.into_inner().iter().fold(0u64, |acc, d| {
                            10 * acc + Into::<u64>::into((*d).saturating_sub(0x30))
                        });
                    }
                    e => todo!("{:?}", e),
                }
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"images" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"artists" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"genres" => loop {
                match reader.read_event_into(&mut buf3).unwrap() {
                    Event::Start(e) if e.name().as_ref() == b"genre" => {
                        match reader.read_event_into(&mut buf5).expect("no genre text") {
                            Event::Text(t) => {
                                let unescape = &t.unescape().unwrap();
                                genre.push(str::from_utf8(unescape.as_bytes()).unwrap().to_owned());
                                reader
                                    .read_to_end_into(e.to_end().name(), &mut buf5)
                                    .expect("unclosed tag");
                            }
                            e => todo!("{:?}", e),
                        }
                    }
                    Event::End(e) if e.name().as_ref() == b"genres" => break,
                    e => todo!("{:?}", e),
                }
            },
            Event::Start(e) if e.name().as_ref() == b"styles" => loop {
                match reader.read_event_into(&mut buf3).unwrap() {
                    Event::Start(e) if e.name().as_ref() == b"style" => {
                        match reader.read_event_into(&mut buf4).expect("no style text") {
                            Event::Text(t) => {
                                let unescape = &t.unescape().unwrap();
                                style.push(str::from_utf8(unescape.as_bytes()).unwrap().to_owned());
                                reader
                                    .read_to_end_into(e.to_end().name(), &mut buf4)
                                    .expect("unclosed tag");
                            }
                            e => todo!("{:?}", e),
                        }
                    }
                    Event::End(e) if e.name().as_ref() == b"styles" => break,
                    e => todo!("{:?}", e),
                }
            },
            Event::Start(e) if e.name().as_ref() == b"year" => {
                match reader.read_event_into(&mut buf5).expect("no year text") {
                    Event::Text(t) => {
                        year = t.into_inner().iter().fold(0u64, |acc, d| {
                            10 * acc + Into::<u64>::into((*d).saturating_sub(0x30))
                        });
                    }
                    e => todo!("{:?}", e),
                }
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"title" => {
                match reader.read_event_into(&mut buf5).expect("no title text") {
                    Event::Text(t) => {
                        let unescape = &t.unescape().unwrap();
                        title = str::from_utf8(unescape.as_bytes()).unwrap().to_owned();
                    }
                    e => todo!("{:?}", e),
                }
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"data_quality" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"videos" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::Start(e) if e.name().as_ref() == b"notes" => {
                reader
                    .read_to_end_into(e.to_end().name(), &mut buf4)
                    .expect("unclosed tag");
            }
            Event::End(e) if e.name().as_ref() == b"master" => {
                return Master {
                    id,
                    release,
                    year,
                    title: title.clone(),
                    style: style.clone(),
                    genre: genre.clone(),
                };
            }
            e => todo!("{:?}", e),
        }
    }
}
