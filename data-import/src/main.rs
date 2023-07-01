use flate2::read::GzDecoder;
use quick_xml::{events::Event, Reader};
use std::str;
use std::{fs::File, io::BufReader};

fn main() {
    /*
    discogs_20230501_artists.xml.gz
    discogs_20230501_labels.xml.gz
    discogs_20230501_masters.xml.gz
    */
    let file = File::open("/home/purport/Code/music/data/discogs_20230501_masters.xml.gz")
        .expect("Unable to open file");
    let file = GzDecoder::new(file);
    let file = BufReader::new(file);
    let mut reader = Reader::from_reader(file);
    reader.trim_text(true);

    let mut buf = Vec::new();
    let mut buf2 = Vec::new();
    let mut buf3 = Vec::new();
    let mut buf4 = Vec::new();
    let mut buf5 = Vec::new();
    let mut master_count = 0;
    loop {
        match reader.read_event_into(&mut buf).unwrap() {
            Event::Eof => break,
            Event::Start(e) if e.name().as_ref() == b"masters" => loop {
                match reader.read_event_into(&mut buf2).unwrap() {
                    Event::Start(e) if e.name().as_ref() == b"master" => {
                        master_count += 1;
                        let id = e
                            .try_get_attribute("id")
                            .expect("master should have an id")
                            .expect("master should have an id");

                        let id = id.value.iter().fold(0u64, |acc, d| {
                            10 * acc + Into::<u64>::into((*d).saturating_sub(0x30))
                        });
                        println!("master id={id}");

                        loop {
                            match reader.read_event_into(&mut buf3).unwrap() {
                                Event::Start(e) if e.name().as_ref() == b"main_release" => {
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
                                Event::Start(e) if e.name().as_ref() == b"year" => {
                                    if let Event::Text(t) =
                                        reader.read_event_into(&mut buf5).expect("no year text")
                                    {
                                        let year = t.into_inner().iter().fold(0u64, |acc, d| {
                                            10 * acc + Into::<u64>::into((*d).saturating_sub(0x30))
                                        });

                                        println!("year {:?}", year);
                                    }
                                    reader
                                        .read_to_end_into(e.to_end().name(), &mut buf4)
                                        .expect("unclosed tag");
                                }
                                Event::Start(e) if e.name().as_ref() == b"title" => {
                                    if let Event::Text(t) =
                                        reader.read_event_into(&mut buf5).expect("no title text")
                                    {
                                        let unescape = &t.unescape().unwrap();
                                        let title = str::from_utf8(unescape.as_bytes()).unwrap();
                                        println!("title {}", title);
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
                                Event::Start(e) => todo!("{:?}", e),
                                Event::End(e) if e.name().as_ref() == b"master" => break,
                                Event::End(e) => todo!("{:?}", e),
                                Event::Empty(_) => todo!(),
                                Event::Text(_) => todo!(),
                                Event::CData(_) => todo!(),
                                Event::Comment(_) => todo!(),
                                Event::Decl(_) => todo!(),
                                Event::PI(_) => todo!(),
                                Event::DocType(_) => todo!(),
                                Event::Eof => todo!(),
                            }
                        }
                    }
                    Event::Start(_) => todo!("{:?}", e),
                    Event::End(e) if e.name().as_ref() == b"masters" => break,
                    Event::End(_) => todo!(),
                    Event::Empty(_) => todo!(),
                    Event::Text(_) => todo!(),
                    Event::CData(_) => todo!(),
                    Event::Comment(_) => todo!(),
                    Event::Decl(_) => todo!(),
                    Event::PI(_) => todo!(),
                    Event::DocType(_) => todo!(),
                    Event::Eof => todo!(),
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

#[derive(Debug, Default)]
struct Master {
    id: String,
    name: String,
}
